using HandsForHire.BusinessLogic.Interfaces;
using HandsForHire.DataAccesLayer.Context;
using HandsForHire.Domain.Entities;
using HandsForHire.Domain.Models.Reports;
using Microsoft.EntityFrameworkCore;

namespace HandsForHire.BusinessLogic.Structure;

public class ReportLogic : IReportLogic
{
    private readonly AppDbContext _context;

    public ReportLogic(AppDbContext context)
    {
        _context = context;
    }

    private IQueryable<ReportDto> Query()
    {
        return _context.Reports
            .Select(r => new ReportDto
            {
                Id = r.Id,
                Title = r.Title,
                Description = r.Description,
                ReporterEmail = r.ReporterEmail,
                Category = r.Category,
                Severity = r.Severity,
                Status = r.Status,
                ActionTaken = r.ActionTaken,
                CreatedAt = r.CreatedAt,
                ResolvedAt = r.ResolvedAt
            });
    }

    public async Task<IEnumerable<ReportDto>> GetAllAsync()
    {
        return await Query()
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<ReportDto?> GetByIdAsync(int id)
    {
        return await Query().FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<ReportDto> CreateAsync(CreateReportDto dto)
    {
        var r = new Report
        {
            Title = dto.Title,
            Description = dto.Description,
            ReporterEmail = dto.ReporterEmail,
            Category = dto.Category,
            Severity = dto.Severity,
            Status = ReportStatus.Pending,
            ActionTaken = ReportAction.None,
            CreatedAt = DateTime.UtcNow,
            ResolvedAt = null
        };

        _context.Reports.Add(r);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(r.Id)
            ?? throw new InvalidOperationException("Failed to load created report.");
    }

    public async Task<bool> UpdateAsync(int id, UpdateReportDto dto)
    {
        var r = await _context.Reports.FindAsync(id);

        if (r == null)
            return false;

        r.Title = dto.Title;
        r.Description = dto.Description;
        r.Category = dto.Category;
        r.Severity = dto.Severity;
        r.ActionTaken = dto.ActionTaken;

        var becameResolved = r.Status != ReportStatus.Resolved && dto.Status == ReportStatus.Resolved;
        r.Status = dto.Status;
        if (becameResolved)
            r.ResolvedAt = DateTime.UtcNow;
        else if (dto.Status == ReportStatus.Pending)
            r.ResolvedAt = null;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var r = await _context.Reports.FindAsync(id);

        if (r == null)
            return false;

        _context.Reports.Remove(r);
        await _context.SaveChangesAsync();
        return true;
    }
}
