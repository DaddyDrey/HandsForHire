using HandsForHire.Domain.Models.Reports;

namespace HandsForHire.BusinessLogic.Interfaces;

public interface IReportLogic
{
    Task<IEnumerable<ReportDto>> GetAllAsync();
    Task<ReportDto?> GetByIdAsync(int id);
    Task<ReportDto> CreateAsync(CreateReportDto dto);
    Task<bool> UpdateAsync(int id, UpdateReportDto dto);
    Task<bool> DeleteAsync(int id);
}
