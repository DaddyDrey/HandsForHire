using HandsForHire.Domain.Models.Conversations;

namespace HandsForHire.BusinessLogic.Interfaces;

public interface IConversationLogic
{
    Task<IEnumerable<ConversationDto>> GetForUserAsync(int userId);
    Task<ConversationDto?> GetByIdAsync(int id);
    Task<ConversationDto> EnsureAsync(CreateConversationDto dto);
    Task<bool> DeleteAsync(int id);
}
