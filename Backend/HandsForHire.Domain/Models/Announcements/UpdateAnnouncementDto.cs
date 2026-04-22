using HandsForHire.Domain.Entities;

namespace HandsForHire.Domain.Models.Announcements;

public class UpdateAnnouncementDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public AnnouncementStatus Status { get; set; }
}
