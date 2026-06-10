using HandsForHire.BusinessLogic.Interfaces;
using HandsForHire.DataAccesLayer.Context;
using HandsForHire.Domain.Models.Pros;
using HandsForHire.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace HandsForHire.BusinessLogic.Structure;

public class ProLogic : IProLogic
{
    private readonly AppDbContext _context;

    public ProLogic(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ProDto>> GetAllAsync()
    {
        return await _context.Pros
            .Select(pro => new ProDto
            {
                Id = pro.Id,
                FullName = pro.FullName,
                Email = pro.Email,
                BirthYear = pro.BirthYear,
                Trade = pro.Trade,
                City = pro.City,
                HourlyRate = pro.HourlyRate,
                Description = pro.Description,
                Status = pro.Status
            })
            .ToListAsync();
    }

    public async Task<ProDto?> GetByIdAsync(int id)
    {
        var pro = await _context.Pros.FindAsync(id);

        if (pro == null)
            return null;

        return new ProDto
        {
            Id = pro.Id,
            FullName = pro.FullName,
            Email = pro.Email,
            BirthYear = pro.BirthYear,
            Trade = pro.Trade,
            City = pro.City,
            HourlyRate = pro.HourlyRate,
            Description = pro.Description,
            Status = pro.Status
        };
    }

    public async Task<ProDto?> GetByEmailAsync(string email)
    {
        var normalized = email.Trim().ToLower();
        var pro = await _context.Pros
            .OrderBy(p => p.Id)
            .FirstOrDefaultAsync(p => p.Email.ToLower() == normalized);

        if (pro == null)
            return null;

        return new ProDto
        {
            Id = pro.Id,
            FullName = pro.FullName,
            Email = pro.Email,
            BirthYear = pro.BirthYear,
            Trade = pro.Trade,
            City = pro.City,
            HourlyRate = pro.HourlyRate,
            Description = pro.Description,
            Status = pro.Status
        };
    }

    public async Task<IEnumerable<ProDto>> GetAllByEmailAsync(string email)
    {
        var normalized = email.Trim().ToLower();

        return await _context.Pros
            .Where(p => p.Email.ToLower() == normalized)
            .OrderByDescending(p => p.Id)
            .Select(pro => new ProDto
            {
                Id = pro.Id,
                FullName = pro.FullName,
                Email = pro.Email,
                BirthYear = pro.BirthYear,
                Trade = pro.Trade,
                City = pro.City,
                HourlyRate = pro.HourlyRate,
                Description = pro.Description,
                Status = pro.Status
            })
            .ToListAsync();
    }

    public async Task<ProDto> CreateAsync(CreateProDto dto)
    {
        await EnsureProfessionExistsAsync(dto.Trade);

        var normalizedEmail = dto.Email.Trim().ToLower();
        var pro = new Pro
        {
            Email = normalizedEmail,
            FullName = dto.FullName.Trim(),
            BirthYear = dto.BirthYear,
            Trade = dto.Trade.Trim(),
            City = dto.City.Trim(),
            HourlyRate = dto.HourlyRate,
            Description = dto.Description.Trim(),
            Status = ProStatus.Pending
        };

        _context.Pros.Add(pro);

        await _context.SaveChangesAsync();

        return new ProDto
        {
            Id = pro.Id,
            FullName = pro.FullName,
            Email = pro.Email,
            BirthYear = pro.BirthYear,
            Trade = pro.Trade,
            City = pro.City,
            HourlyRate = pro.HourlyRate,
            Description = pro.Description,
            Status = pro.Status
        };
    }

    public async Task<bool> UpdateAsync(int id, UpdateProDto dto)
    {
        await EnsureProfessionExistsAsync(dto.Trade);

        var pro = await _context.Pros.FindAsync(id);

        if (pro == null)
            return false;

        pro.FullName = dto.FullName.Trim();
        pro.BirthYear = dto.BirthYear;
        pro.Trade = dto.Trade.Trim();
        pro.City = dto.City.Trim();
        pro.HourlyRate = dto.HourlyRate;
        pro.Description = dto.Description.Trim();

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> SetStatusAsync(int id, ProStatus status)
    {
        var pro = await _context.Pros.FindAsync(id);

        if (pro == null)
            return false;

        pro.Status = status;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var pro = await _context.Pros.FindAsync(id);

        if (pro == null)
            return false;

        _context.Pros.Remove(pro);
        await _context.SaveChangesAsync();
        return true;
    }

    private async Task EnsureProfessionExistsAsync(string trade)
    {
        var normalized = trade.Trim().ToLower();
        var exists = await _context.Professions.AnyAsync(p => p.Name.ToLower() == normalized);

        if (!exists)
        {
            _context.Professions.Add(new Profession { Name = trade.Trim() });
            await _context.SaveChangesAsync();
        }
    }
}
