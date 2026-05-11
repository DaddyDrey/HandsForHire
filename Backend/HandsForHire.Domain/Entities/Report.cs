namespace HandsForHire.Domain.Entities;

public enum ReportCategory
{
    Conduct = 0,
    Reliability = 1,
    Payment = 2,
    Fraud = 3,
    Spam = 4,
    Other = 5
}

public enum ReportSeverity
{
    Medium = 0,
    High = 1
}

public enum ReportStatus
{
    Pending = 0,
    Resolved = 1
}

public enum ReportAction
{
    None = 0,
    Reviewed = 1,
    Suspended = 2,
    Escalated = 3,
    Warned = 4
}

public class Report
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ReporterEmail { get; set; } = string.Empty;
    public ReportCategory Category { get; set; }
    public ReportSeverity Severity { get; set; } = ReportSeverity.Medium;
    public ReportStatus Status { get; set; } = ReportStatus.Pending;
    public ReportAction ActionTaken { get; set; } = ReportAction.None;
    public DateTime CreatedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
}
