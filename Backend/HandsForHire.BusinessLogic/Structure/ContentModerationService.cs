using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
using HandsForHire.BusinessLogic.Interfaces;

namespace HandsForHire.BusinessLogic.Structure;

public class ContentModerationService : IContentModerationService
{
    private static readonly Regex WordRegex = new(@"[\p{L}\p{N}_]+", RegexOptions.Compiled);
    private const int MinCompactWordLength = 3;
    private readonly string? _contentRootPath;
    private readonly Lazy<ModerationTerms> _blockedWords;

    public ContentModerationService(string? contentRootPath = null)
    {
        _contentRootPath = contentRootPath;
        _blockedWords = new Lazy<ModerationTerms>(LoadBlockedWords);
    }

    public void EnsureAllowed(params string?[] values)
    {
        var blockedWords = _blockedWords.Value;

        if (blockedWords.NormalizedTerms.Count == 0)
            return;

        foreach (var value in values)
        {
            if (string.IsNullOrWhiteSpace(value))
                continue;

            if (FindBlockedSpans(value, blockedWords).Count > 0)
                throw new InvalidOperationException("Text contains prohibited language.");
        }
    }

    public string SanitizeText(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return value ?? string.Empty;

        var blockedWords = _blockedWords.Value;

        if (blockedWords.NormalizedTerms.Count == 0)
            return value;

        var spans = FindBlockedSpans(value, blockedWords);

        if (spans.Count == 0)
            return value;

        return ReplaceSpans(value, spans);
    }

    private ModerationTerms LoadBlockedWords()
    {
        var candidates = new List<string?>
        {
            _contentRootPath == null ? null : Path.Combine(_contentRootPath, "badwords.local.txt"),
            _contentRootPath == null ? null : Path.Combine(_contentRootPath, "Moderation", "badwords.local.txt"),
            _contentRootPath == null ? null : Path.Combine(_contentRootPath, "HandsForHire.API", "badwords.local.txt"),
            Path.Combine(AppContext.BaseDirectory, "badwords.local.txt"),
            Path.Combine(Directory.GetCurrentDirectory(), "badwords.local.txt"),
            Path.Combine(Directory.GetCurrentDirectory(), "HandsForHire.API", "badwords.local.txt"),
            Path.Combine(Directory.GetCurrentDirectory(), "Backend", "HandsForHire.API", "badwords.local.txt"),
            Path.Combine(Directory.GetCurrentDirectory(), "Moderation", "badwords.local.txt")
        };

        candidates.AddRange(FindLocalWordListPaths(_contentRootPath));
        candidates.AddRange(FindLocalWordListPaths(Directory.GetCurrentDirectory()));

        var path = candidates.FirstOrDefault(path => path != null && File.Exists(path));

        if (path == null)
            return new ModerationTerms([], []);

        var normalizedTerms = File.ReadLines(path)
            .Select(line => line.Split('#')[0].Trim())
            .Where(line => !string.IsNullOrWhiteSpace(line))
            .Select(Normalize)
            .Distinct(StringComparer.Ordinal)
            .OrderByDescending(term => term.Length)
            .ToList();

        var compactWords = normalizedTerms
            .Select(Compact)
            .Where(word => word.Length >= MinCompactWordLength)
            .Distinct(StringComparer.Ordinal)
            .OrderByDescending(term => term.Length)
            .ToList();

        return new ModerationTerms(normalizedTerms, compactWords);
    }

    private static string Normalize(string value)
    {
        var normalized = value.Normalize(NormalizationForm.FormD);
        var builder = new StringBuilder(normalized.Length);

        foreach (var c in normalized)
        {
            if (CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark)
                builder.Append(char.ToLowerInvariant(c));
        }

        return builder.ToString().Normalize(NormalizationForm.FormC);
    }

    private static string Compact(string value)
    {
        var builder = new StringBuilder(value.Length);

        foreach (var c in value)
        {
            if (char.IsLetterOrDigit(c))
                builder.Append(c);
        }

        return builder.ToString();
    }

    private static List<TextSpan> FindBlockedSpans(string value, ModerationTerms blockedWords)
    {
        var spans = new List<TextSpan>();
        var normalized = NormalizeWithMap(value);
        var compact = CompactWithMap(normalized.Value, normalized.Map);
        var collapsedCompact = CollapseRepeatedCharactersWithMap(compact.Value, compact.Map);

        foreach (Match match in WordRegex.Matches(normalized.Value))
        {
            foreach (var term in blockedWords.NormalizedTerms)
            {
                if (IsBlockedWordMatch(match.Value, term))
                    spans.Add(new TextSpan(normalized.Map[match.Index], normalized.Map[match.Index + match.Length - 1] + 1));
            }
        }

        foreach (var term in blockedWords.NormalizedTerms)
        {
            AddTermSpans(spans, normalized.Value, normalized.Map, term, requireBoundaries: true);
        }

        foreach (var term in blockedWords.CompactTerms)
        {
            AddTermSpans(spans, compact.Value, compact.Map, term, requireBoundaries: false);
            AddTermSpans(spans, collapsedCompact.Value, collapsedCompact.Map, CollapseRepeatedCharacters(term), requireBoundaries: false);
        }

        return MergeSpans(spans);
    }

    private static bool IsBlockedWordMatch(string word, string term)
    {
        if (term.Length == 0)
            return false;

        if (word.Equals(term, StringComparison.Ordinal))
            return true;

        return term.Length >= MinCompactWordLength + 1 &&
               char.IsLetterOrDigit(term[0]) &&
               char.IsLetterOrDigit(term[^1]) &&
               word.Contains(term, StringComparison.Ordinal);
    }

    private static void AddTermSpans(
        List<TextSpan> spans,
        string searchable,
        IReadOnlyList<int> indexMap,
        string term,
        bool requireBoundaries)
    {
        if (term.Length == 0 || term.Length > searchable.Length)
            return;

        var start = 0;

        while (start < searchable.Length)
        {
            var index = searchable.IndexOf(term, start, StringComparison.Ordinal);

            if (index < 0)
                break;

            if (!requireBoundaries || HasTermBoundaries(searchable, term, index))
            {
                var originalStart = indexMap[index];
                var originalEnd = indexMap[index + term.Length - 1] + 1;
                spans.Add(new TextSpan(originalStart, originalEnd));
            }

            start = index + 1;
        }
    }

    private static bool HasTermBoundaries(string value, string term, int start)
    {
        var end = start + term.Length;
        var startsWithWord = char.IsLetterOrDigit(term[0]);
        var endsWithWord = char.IsLetterOrDigit(term[^1]);
        var leftOk = !startsWithWord || start == 0 || !char.IsLetterOrDigit(value[start - 1]);
        var rightOk = !endsWithWord || end >= value.Length || !char.IsLetterOrDigit(value[end]);

        return leftOk && rightOk;
    }

    private static string ReplaceSpans(string value, IReadOnlyList<TextSpan> spans)
    {
        var builder = new StringBuilder(value.Length);
        var position = 0;

        foreach (var span in spans)
        {
            if (span.Start > position)
                builder.Append(value, position, span.Start - position);

            builder.Append("****");
            position = span.End;
        }

        if (position < value.Length)
            builder.Append(value, position, value.Length - position);

        return builder.ToString();
    }

    private static List<TextSpan> MergeSpans(List<TextSpan> spans)
    {
        if (spans.Count < 2)
            return spans;

        var ordered = spans
            .OrderBy(span => span.Start)
            .ThenByDescending(span => span.End)
            .ToList();
        var merged = new List<TextSpan> { ordered[0] };

        foreach (var span in ordered.Skip(1))
        {
            var last = merged[^1];

            if (span.Start <= last.End)
            {
                merged[^1] = new TextSpan(last.Start, Math.Max(last.End, span.End));
                continue;
            }

            merged.Add(span);
        }

        return merged;
    }

    private static MappedText NormalizeWithMap(string value)
    {
        var builder = new StringBuilder(value.Length);
        var map = new List<int>(value.Length);

        for (var i = 0; i < value.Length; i++)
        {
            var normalized = value[i].ToString().Normalize(NormalizationForm.FormD);

            foreach (var c in normalized)
            {
                if (CharUnicodeInfo.GetUnicodeCategory(c) == UnicodeCategory.NonSpacingMark)
                    continue;

                builder.Append(char.ToLowerInvariant(c));
                map.Add(i);
            }
        }

        return new MappedText(builder.ToString().Normalize(NormalizationForm.FormC), map);
    }

    private static MappedText CompactWithMap(string value, IReadOnlyList<int> sourceMap)
    {
        var builder = new StringBuilder(value.Length);
        var map = new List<int>(value.Length);

        for (var i = 0; i < value.Length; i++)
        {
            if (!char.IsLetterOrDigit(value[i]))
                continue;

            builder.Append(value[i]);
            map.Add(sourceMap[i]);
        }

        return new MappedText(builder.ToString(), map);
    }

    private static MappedText CollapseRepeatedCharactersWithMap(string value, IReadOnlyList<int> sourceMap)
    {
        if (value.Length < 2)
            return new MappedText(value, sourceMap.ToList());

        var builder = new StringBuilder(value.Length);
        var map = new List<int>(value.Length);
        var previous = '\0';

        for (var i = 0; i < value.Length; i++)
        {
            if (value[i] == previous)
                continue;

            builder.Append(value[i]);
            map.Add(sourceMap[i]);
            previous = value[i];
        }

        return new MappedText(builder.ToString(), map);
    }

    private static IEnumerable<string> FindLocalWordListPaths(string? startPath)
    {
        if (string.IsNullOrWhiteSpace(startPath))
            yield break;

        var directory = Directory.Exists(startPath)
            ? new DirectoryInfo(startPath)
            : Directory.GetParent(startPath);

        while (directory != null)
        {
            yield return Path.Combine(directory.FullName, "badwords.local.txt");
            yield return Path.Combine(directory.FullName, "HandsForHire.API", "badwords.local.txt");
            yield return Path.Combine(directory.FullName, "Backend", "HandsForHire.API", "badwords.local.txt");
            directory = directory.Parent;
        }
    }

    private static string CollapseRepeatedCharacters(string value)
    {
        if (value.Length < 2)
            return value;

        var builder = new StringBuilder(value.Length);
        var previous = '\0';

        foreach (var c in value)
        {
            if (c != previous)
                builder.Append(c);

            previous = c;
        }

        return builder.ToString();
    }

    private sealed record ModerationTerms(IReadOnlyList<string> NormalizedTerms, IReadOnlyList<string> CompactTerms);

    private sealed record MappedText(string Value, IReadOnlyList<int> Map);

    private readonly record struct TextSpan(int Start, int End);
}
