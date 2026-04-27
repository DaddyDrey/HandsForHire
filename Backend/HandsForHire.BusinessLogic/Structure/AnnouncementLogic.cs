using HandsForHire.BusinessLogic.Interfaces;
using HandsForHire.DataAccesLayer.Context;
using HandsForHire.Domain.Entities;
using HandsForHire.Domain.Models.Announcements;
using Microsoft.EntityFrameworkCore;

namespace HandsForHire.BusinessLogic.Structure;

public class AnnouncementLogic : IAnnouncementLogic
{
    private readonly AppDbContext _context;

    public AnnouncementLogic(AppDbContext context)
    {
        _context = context;
    }

    private IQueryable<AnnouncementDto> Query()
    {
        return _context.Announcements
            .Select(a => new AnnouncementDto
            {
                Id = a.Id,
                UserId = a.UserId,
                AuthorName = _context.Users.Where(u => u.Id == a.UserId).Select(u => u.FullName).FirstOrDefault() ?? string.Empty,
                AuthorEmail = _context.Users.Where(u => u.Id == a.UserId).Select(u => u.Email).FirstOrDefault() ?? string.Empty,
                Title = a.Title,
                Description = a.Description,
                Category = a.Category,
                City = a.City,
                Status = a.Status,
                CreatedAt = a.CreatedAt,
                UpdatedAt = a.UpdatedAt
            });
    }

    public async Task<IEnumerable<AnnouncementDto>> GetAllAsync()
    {
        return await Query()
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<AnnouncementDto>> GetForUserAsync(int userId)
    {
        return await Query()
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();
    }

    public async Task<AnnouncementDto?> GetByIdAsync(int id)
    {
        return await Query().FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task<AnnouncementDto> CreateAsync(CreateAnnouncementDto dto)
    {
        var now = DateTime.UtcNow;
        var a = new Announcement
        {
            UserId = dto.UserId,
            Title = dto.Title,
            Description = dto.Description,
            Category = dto.Category,
            City = dto.City,
            Status = AnnouncementStatus.Open,
            CreatedAt = now,
            UpdatedAt = now
        };

        _context.Announcements.Add(a);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(a.Id)
            ?? throw new InvalidOperationException("Failed to load created announcement.");
    }

    public async Task<bool> UpdateAsync(int id, UpdateAnnouncementDto dto)
    {
        var a = await _context.Announcements.FindAsync(id);

        if (a == null)
            return false;

        a.Title = dto.Title;
        a.Description = dto.Description;
        a.Category = dto.Category;
        a.City = dto.City;
        a.Status = dto.Status;
        a.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var a = await _context.Announcements.FindAsync(id);

        if (a == null)
            return false;

        _context.Announcements.Remove(a);
        await _context.SaveChangesAsync();
        return true;
    }
}
