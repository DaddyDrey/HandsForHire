namespace HandsForHire.Domain.Entities;

public enum MessageSender
{
    User = 0,
    Pro = 1
}

public class Message
{
    public int Id { get; set; }
    public int ConversationId { get; set; }
    public MessageSender From { get; set; }
    public string Body { get; set; } = string.Empty;
    public DateTime SentAt { get; set; }
    public DateTime? ReadAt { get; set; }

    public Conversation? Conversation { get; set; }
}
