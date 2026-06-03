namespace HandsForHire.Domain.Models.Conversations;

public class ConversationDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int ProId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string UserEmail { get; set; } = string.Empty;
    public string ProName { get; set; } = string.Empty;
    public string ProTrade { get; set; } = string.Empty;
    public string ProCity { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime LastMessageAt { get; set; }
    public int UnreadCount { get; set; }
    public string? LastMessageBody { get; set; }
}
