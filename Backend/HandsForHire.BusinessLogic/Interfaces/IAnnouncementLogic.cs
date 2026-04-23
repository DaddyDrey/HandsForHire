using HandsForHire.Domain.Models.Announcements;

namespace HandsForHire.BusinessLogic.Interfaces;

public interface IAnnouncementLogic
{
    Task<IEnumerable<AnnouncementDto>> GetAllAsync();
    Task<IEnumerable<AnnouncementDto>> GetForUserAsync(int userId);
    Task<AnnouncementDto?> GetByIdAsync(int id);
    Task<AnnouncementDto> CreateAsync(CreateAnnouncementDto dto);
    Task<bool> UpdateAsync(int id, UpdateAnnouncementDto dto);
    Task<bool> DeleteAsync(int id);
}
