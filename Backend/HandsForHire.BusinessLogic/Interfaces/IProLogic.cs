using HandsForHire.Domain.Models.Pros;

namespace HandsForHire.BusinessLogic.Interfaces;

public interface IProLogic
{
	Task<IEnumerable<ProDto>> GetAllAsync();
	Task<ProDto?> GetByIdAsync(int id);
	Task<ProDto?> GetByEmailAsync(string email);
	Task<ProDto> CreateAsync(CreateProDto dto);
	Task<bool> UpdateAsync(int id, UpdateProDto dto);
	Task<bool> DeleteAsync(int id);
}