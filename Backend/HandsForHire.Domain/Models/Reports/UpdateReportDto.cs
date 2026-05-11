using HandsForHire.Domain.Entities;

namespace HandsForHire.Domain.Models.Reports;

public class UpdateReportDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public ReportCategory Category { get; set; }
    public ReportSeverity Severity { get; set; }
    public ReportStatus Status { get; set; }
    public ReportAction ActionTaken { get; set; }
}
