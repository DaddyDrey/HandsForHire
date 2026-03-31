using HandsForHire.Domain.DTOs.Pros;

namespace HandsForHire.BusinessLayer.Interfaces;

public interface IProService
{
	Task<IEnumerable<ProDto>> GetAllAsync();
	Task<ProDto?> GetByIdAsync(int id);
	Task<ProDto> CreateAsync(CreateProDto dto);
	Task<bool> UpdateAsync(int id, UpdateProDto dto);
	Task<bool> DeleteAsync(int id);
}