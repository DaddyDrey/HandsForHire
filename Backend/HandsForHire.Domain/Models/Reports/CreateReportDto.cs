using HandsForHire.Domain.Entities;

namespace HandsForHire.Domain.Models.Reports;

public class CreateReportDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ReporterEmail { get; set; } = string.Empty;
    public string TargetEmail { get; set; } = string.Empty;
    public ReportCategory Category { get; set; }
    public ReportSeverity Severity { get; set; } = ReportSeverity.Medium;
}
