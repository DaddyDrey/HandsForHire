namespace HandsForHire.Domain.Entities;

public enum AnnouncementStatus
{
    Open = 0,
    InProgress = 1,
    Completed = 2,
    Cancelled = 3,
    Paused = 4
}

public class Announcement
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public AnnouncementStatus Status { get; set; } = AnnouncementStatus.Open;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
