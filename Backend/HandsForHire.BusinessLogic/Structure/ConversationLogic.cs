using HandsForHire.BusinessLogic.Interfaces;
using HandsForHire.DataAccesLayer.Context;
using HandsForHire.Domain.Entities;
using HandsForHire.Domain.Models.Conversations;
using Microsoft.EntityFrameworkCore;

namespace HandsForHire.BusinessLogic.Structure;

public class ConversationLogic : IConversationLogic
{
    private readonly AppDbContext _context;

    public ConversationLogic(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ConversationDto>> GetForUserAsync(int userId)
    {
        return await _context.Conversations
            .Where(c => c.UserId == userId)
            .OrderByDescending(c => c.LastMessageAt)
            .Select(c => new ConversationDto
            {
                Id = c.Id,
                UserId = c.UserId,
                ProId = c.ProId,
                ProName = _context.Pros.Where(p => p.Id == c.ProId).Select(p => p.FullName).FirstOrDefault() ?? string.Empty,
                ProTrade = _context.Pros.Where(p => p.Id == c.ProId).Select(p => p.Trade).FirstOrDefault() ?? string.Empty,
                ProCity = _context.Pros.Where(p => p.Id == c.ProId).Select(p => p.City).FirstOrDefault() ?? string.Empty,
                CreatedAt = c.CreatedAt,
                LastMessageAt = c.LastMessageAt,
                UnreadCount = c.Messages.Count(m => m.From == MessageSender.Pro && m.ReadAt == null),
                LastMessageBody = c.Messages
                    .OrderByDescending(m => m.SentAt)
                    .Select(m => m.Body)
                    .FirstOrDefault()
            })
            .ToListAsync();
    }

    public async Task<ConversationDto?> GetByIdAsync(int id)
    {
        var dto = await _context.Conversations
            .Where(c => c.Id == id)
            .Select(c => new ConversationDto
            {
                Id = c.Id,
                UserId = c.UserId,
                ProId = c.ProId,
                ProName = _context.Pros.Where(p => p.Id == c.ProId).Select(p => p.FullName).FirstOrDefault() ?? string.Empty,
                ProTrade = _context.Pros.Where(p => p.Id == c.ProId).Select(p => p.Trade).FirstOrDefault() ?? string.Empty,
                ProCity = _context.Pros.Where(p => p.Id == c.ProId).Select(p => p.City).FirstOrDefault() ?? string.Empty,
                CreatedAt = c.CreatedAt,
                LastMessageAt = c.LastMessageAt,
                UnreadCount = c.Messages.Count(m => m.From == MessageSender.Pro && m.ReadAt == null),
                LastMessageBody = c.Messages
                    .OrderByDescending(m => m.SentAt)
                    .Select(m => m.Body)
                    .FirstOrDefault()
            })
            .FirstOrDefaultAsync();

        return dto;
    }

    public async Task<ConversationDto> EnsureAsync(CreateConversationDto dto)
    {
        var existing = await _context.Conversations
            .FirstOrDefaultAsync(c => c.UserId == dto.UserId && c.ProId == dto.ProId);

        int id;
        if (existing != null)
        {
            id = existing.Id;
        }
        else
        {
            var now = DateTime.UtcNow;
            var conversation = new Conversation
            {
                UserId = dto.UserId,
                ProId = dto.ProId,
                CreatedAt = now,
                LastMessageAt = now
            };

            _context.Conversations.Add(conversation);
            await _context.SaveChangesAsync();
            id = conversation.Id;
        }

        var result = await GetByIdAsync(id);
        return result!;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var conversation = await _context.Conversations
            .Include(c => c.Messages)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (conversation == null)
            return false;

        _context.Messages.RemoveRange(conversation.Messages);
        _context.Conversations.Remove(conversation);
        await _context.SaveChangesAsync();
        return true;
    }
}
