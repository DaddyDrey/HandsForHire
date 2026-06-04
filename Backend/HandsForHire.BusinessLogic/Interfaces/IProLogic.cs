using HandsForHire.Domain.Entities;
using HandsForHire.Domain.Models.Pros;

namespace HandsForHire.BusinessLogic.Interfaces;

public interface IProLogic
{
	Task<IEnumerable<ProDto>> GetAllAsync();
	Task<ProDto?> GetByIdAsync(int id);
	Task<ProDto?> GetByEmailAsync(string email);
	Task<IEnumerable<ProDto>> GetAllByEmailAsync(string email);
	Task<ProDto> CreateAsync(CreateProDto dto);
	Task<bool> UpdateAsync(int id, UpdateProDto dto);
	Task<bool> SetStatusAsync(int id, ProStatus status);
	Task<bool> DeleteAsync(int id);
}
