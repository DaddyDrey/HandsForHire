using HandsForHire.BusinessLogic.Interfaces;
using HandsForHire.DataAccesLayer.Context;
using HandsForHire.Domain.Entities;
using HandsForHire.Domain.Models.Professions;
using Microsoft.EntityFrameworkCore;

namespace HandsForHire.BusinessLogic.Structure;

public class ProfessionLogic : IProfessionLogic
{
    private readonly AppDbContext _context;

    public ProfessionLogic(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ProfessionDto>> GetAllAsync()
    {
        return await _context.Professions
            .OrderBy(p => p.Name)
            .Select(p => new ProfessionDto
            {
                Id = p.Id,
                Name = p.Name
            })
            .ToListAsync();
    }

    public async Task<ProfessionDto?> GetByIdAsync(int id)
    {
        var profession = await _context.Professions.FindAsync(id);

        if (profession == null)
            return null;

        return new ProfessionDto
        {
            Id = profession.Id,
            Name = profession.Name
        };
    }

    public async Task<ProfessionDto> CreateAsync(CreateProfessionDto dto)
    {
        var name = dto.Name.Trim();
        if (string.IsNullOrWhiteSpace(name))
            throw new InvalidOperationException("Profession name is required.");

        var exists = await _context.Professions
            .AnyAsync(p => p.Name.ToLower() == name.ToLower());

        if (exists)
            throw new InvalidOperationException("Profession already exists.");

        var profession = new Profession { Name = name };
        _context.Professions.Add(profession);
        await _context.SaveChangesAsync();

        return new ProfessionDto
        {
            Id = profession.Id,
            Name = profession.Name
        };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var profession = await _context.Professions.FindAsync(id);

        if (profession == null)
            return false;

        _context.Professions.Remove(profession);
        await _context.SaveChangesAsync();
        return true;
    }
}
