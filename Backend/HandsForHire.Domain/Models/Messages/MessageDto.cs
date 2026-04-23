using HandsForHire.Domain.Entities;

namespace HandsForHire.Domain.Models.Messages;

public class MessageDto
{
    public int Id { get; set; }
    public int ConversationId { get; set; }
    public MessageSender From { get; set; }
    public string Body { get; set; } = string.Empty;
    public DateTime SentAt { get; set; }
    public DateTime? ReadAt { get; set; }
}
