using HandsForHire.Domain.Entities;

namespace HandsForHire.Domain.Models.Announcements;

public class AnnouncementDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string AuthorName { get; set; } = string.Empty;
    public string AuthorEmail { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public AnnouncementStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
