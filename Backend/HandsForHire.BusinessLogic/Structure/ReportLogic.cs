using HandsForHire.BusinessLogic.Interfaces;
using HandsForHire.DataAccesLayer.Context;
using HandsForHire.Domain.Entities;
using HandsForHire.Domain.Models.Reports;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace HandsForHire.BusinessLogic.Structure;

public class ReportLogic : IReportLogic
{
    private readonly AppDbContext _context;

    public ReportLogic(AppDbContext context)
    {
        _context = context;
    }

    private IQueryable<ReportDto> Query()
    {
        return _context.Reports
            .Select(r => new ReportDto
            {
                Id = r.Id,
                Title = r.Title,
                Description = r.Description,
                ReporterEmail = r.ReporterEmail,
                TargetEmail = r.TargetEmail,
                Category = r.Category,
                Severity = r.Severity,
                Status = r.Status,
                ActionTaken = r.ActionTaken,
                CreatedAt = r.CreatedAt,
                ResolvedAt = r.ResolvedAt
            });
    }

    public async Task<IEnumerable<ReportDto>> GetAllAsync()
    {
        return await Query()
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<ReportDto?> GetByIdAsync(int id)
    {
        return await Query().FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<ReportDto> CreateAsync(CreateReportDto dto)
    {
        var r = new Report
        {
            Title = dto.Title,
            Description = dto.Description,
            ReporterEmail = NormalizeEmail(dto.ReporterEmail),
            TargetEmail = NormalizeEmail(dto.TargetEmail),
            Category = dto.Category,
            Severity = dto.Severity,
            Status = ReportStatus.Pending,
            ActionTaken = ReportAction.None,
            CreatedAt = DateTime.UtcNow,
            ResolvedAt = null
        };

        _context.Reports.Add(r);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(r.Id)
            ?? throw new InvalidOperationException("Failed to load created report.");
    }

    public async Task<bool> UpdateAsync(int id, UpdateReportDto dto)
    {
        var r = await _context.Reports.FindAsync(id);

        if (r == null)
            return false;

        r.Title = dto.Title;
        r.Description = dto.Description;
        r.Category = dto.Category;
        r.Severity = dto.Severity;
        r.ActionTaken = dto.ActionTaken;

        var becameResolved = r.Status != ReportStatus.Resolved && dto.Status == ReportStatus.Resolved;
        r.Status = dto.Status;
        if (becameResolved)
            r.ResolvedAt = DateTime.UtcNow;
        else if (dto.Status == ReportStatus.Pending)
            r.ResolvedAt = null;

        if (becameResolved)
            await ApplyActionToTargetAsync(r);

        await _context.SaveChangesAsync();
        return true;
    }

    private async Task ApplyActionToTargetAsync(Report report)
    {
        var targetEmail = string.IsNullOrWhiteSpace(report.TargetEmail)
            ? await InferTargetEmailAsync(report)
            : NormalizeEmail(report.TargetEmail);

        if (string.IsNullOrWhiteSpace(targetEmail))
            return;

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == targetEmail);
        if (user == null)
            return;

        if (report.ActionTaken == ReportAction.Warned)
            user.WarningCount += 1;
        else if (report.ActionTaken == ReportAction.Suspended)
            user.Status = UserStatus.Suspended;
    }

    private static string NormalizeEmail(string email)
    {
        return email.Trim().ToLower();
    }

    private async Task<string> InferTargetEmailAsync(Report report)
    {
        var reporter = NormalizeEmail(report.ReporterEmail);
        var matches = Regex.Matches($"{report.Title} {report.Description}", @"[^\s<>()[\],;:]+@[^\s<>()[\],;:]+\.[^\s<>()[\],;:.]+");

        foreach (Match match in matches)
        {
            var email = NormalizeEmail(match.Value);
            if (email != reporter)
                return email;
        }

        var reportedName = ExtractReportedName(report);
        if (!string.IsNullOrWhiteSpace(reportedName))
        {
            var normalizedName = NormalizeName(reportedName);
            var users = await _context.Users
                .Where(u => u.Email.ToLower() != reporter)
                .Select(u => new { u.Email, u.FullName })
                .ToListAsync();
            var user = users.FirstOrDefault(u =>
                NormalizeName(u.FullName) == normalizedName || NormalizeName(u.Email.Split('@')[0]) == normalizedName);

            if (user != null)
                return NormalizeEmail(user.Email);

            var pros = await _context.Pros
                .Where(p => p.Email.ToLower() != reporter)
                .Select(p => new { p.Email, p.FullName })
                .ToListAsync();
            var pro = pros.FirstOrDefault(p =>
                NormalizeName(p.FullName) == normalizedName || NormalizeName(p.Email.Split('@')[0]) == normalizedName);

            if (pro != null)
                return NormalizeEmail(pro.Email);
        }

        return string.Empty;
    }

    private static string ExtractReportedName(Report report)
    {
        var match = Regex.Match(report.Title, @"\bwith\s+(.+)$", RegexOptions.IgnoreCase);
        return match.Success ? match.Groups[1].Value.Trim() : string.Empty;
    }

    private static string NormalizeName(string value)
    {
        return Regex.Replace(value.Trim().ToLower(), @"[^a-z0-9]+", string.Empty);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var r = await _context.Reports.FindAsync(id);

        if (r == null)
            return false;

        _context.Reports.Remove(r);
        await _context.SaveChangesAsync();
        return true;
    }
}
