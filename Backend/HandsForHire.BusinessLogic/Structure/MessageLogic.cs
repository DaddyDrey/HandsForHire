using HandsForHire.BusinessLogic.Interfaces;
using HandsForHire.DataAccesLayer.Context;
using HandsForHire.Domain.Entities;
using HandsForHire.Domain.Models.Messages;
using Microsoft.EntityFrameworkCore;

namespace HandsForHire.BusinessLogic.Structure;

public class MessageLogic : IMessageLogic
{
    private readonly AppDbContext _context;

    public MessageLogic(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<MessageDto>> GetByConversationAsync(int conversationId)
    {
        return await _context.Messages
            .Where(m => m.ConversationId == conversationId)
            .OrderBy(m => m.SentAt)
            .Select(m => new MessageDto
            {
                Id = m.Id,
                ConversationId = m.ConversationId,
                From = m.From,
                Body = m.Body,
                SentAt = m.SentAt,
                ReadAt = m.ReadAt
            })
            .ToListAsync();
    }

    public async Task<MessageDto> CreateAsync(CreateMessageDto dto)
    {
        var conversation = await _context.Conversations.FindAsync(dto.ConversationId)
            ?? throw new InvalidOperationException("Conversation not found.");

        var now = DateTime.UtcNow;
        var message = new Message
        {
            ConversationId = dto.ConversationId,
            From = dto.From,
            Body = dto.Body,
            SentAt = now,
            ReadAt = dto.From == MessageSender.User ? now : null
        };

        _context.Messages.Add(message);
        conversation.LastMessageAt = now;
        await _context.SaveChangesAsync();

        return new MessageDto
        {
            Id = message.Id,
            ConversationId = message.ConversationId,
            From = message.From,
            Body = message.Body,
            SentAt = message.SentAt,
            ReadAt = message.ReadAt
        };
    }

    public async Task<bool> MarkConversationReadAsync(int conversationId)
    {
        return await MarkConversationReadAsync(conversationId, MessageSender.User);
    }

    public async Task<bool> MarkConversationReadAsync(int conversationId, MessageSender viewer)
    {
        var unreadFrom = viewer == MessageSender.User ? MessageSender.Pro : MessageSender.User;
        var unread = await _context.Messages
            .Where(m => m.ConversationId == conversationId
                        && m.From == unreadFrom
                        && m.ReadAt == null)
            .ToListAsync();

        if (unread.Count == 0)
            return false;

        var now = DateTime.UtcNow;
        foreach (var m in unread)
            m.ReadAt = now;

        await _context.SaveChangesAsync();
        return true;
    }
}
