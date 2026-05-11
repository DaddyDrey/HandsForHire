using HandsForHire.Domain.Models.Professions;

namespace HandsForHire.BusinessLogic.Interfaces;

public interface IProfessionLogic
{
    Task<IEnumerable<ProfessionDto>> GetAllAsync();
    Task<ProfessionDto?> GetByIdAsync(int id);
    Task<ProfessionDto> CreateAsync(CreateProfessionDto dto);
    Task<bool> DeleteAsync(int id);
}
