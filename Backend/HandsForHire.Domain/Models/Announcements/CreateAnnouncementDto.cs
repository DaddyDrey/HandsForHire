namespace HandsForHire.Domain.Models.Announcements;

public class CreateAnnouncementDto
{
    public int UserId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
}
