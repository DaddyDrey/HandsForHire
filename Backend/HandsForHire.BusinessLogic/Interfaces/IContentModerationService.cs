namespace HandsForHire.BusinessLogic.Interfaces;

public interface IContentModerationService
{
    void EnsureAllowed(params string?[] values);
    string SanitizeText(string? value);
}
