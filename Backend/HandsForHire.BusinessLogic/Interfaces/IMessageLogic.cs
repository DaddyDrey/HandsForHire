using HandsForHire.Domain.Entities;
using HandsForHire.Domain.Models.Messages;

namespace HandsForHire.BusinessLogic.Interfaces;

public interface IMessageLogic
{
    Task<IEnumerable<MessageDto>> GetByConversationAsync(int conversationId);
    Task<MessageDto> CreateAsync(CreateMessageDto dto);
    Task<bool> MarkConversationReadAsync(int conversationId);
    Task<bool> MarkConversationReadAsync(int conversationId, MessageSender viewer);
}
