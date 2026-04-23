using HandsForHire.Domain.Entities;

namespace HandsForHire.Domain.Models.Messages;

public class CreateMessageDto
{
    public int ConversationId { get; set; }
    public MessageSender From { get; set; }
    public string Body { get; set; } = string.Empty;
}
