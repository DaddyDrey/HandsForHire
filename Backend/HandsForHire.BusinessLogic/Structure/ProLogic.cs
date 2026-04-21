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
                Trade = pro.Trade,
                City = pro.City,
                HourlyRate = pro.HourlyRate
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
            Trade = pro.Trade,
            City = pro.City,
            HourlyRate = pro.HourlyRate
        };
    }

    public async Task<ProDto> CreateAsync(CreateProDto dto)
    {
        var pro = new Pro
        {
            FullName = dto.FullName,
            Trade = dto.Trade,
            City = dto.City,
            HourlyRate = dto.HourlyRate
        };

        _context.Pros.Add(pro);
        await _context.SaveChangesAsync();

        return new ProDto
        {
            Id = pro.Id,
            FullName = pro.FullName,
            Trade = pro.Trade,
            City = pro.City,
            HourlyRate = pro.HourlyRate
        };
    }

    public async Task<bool> UpdateAsync(int id, UpdateProDto dto)
    {
        var pro = await _context.Pros.FindAsync(id);

        if (pro == null)
            return false;

        pro.FullName = dto.FullName;
        pro.Trade = dto.Trade;
        pro.City = dto.City;
        pro.HourlyRate = dto.HourlyRate;

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
}