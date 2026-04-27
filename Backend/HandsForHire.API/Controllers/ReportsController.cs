using HandsForHire.BusinessLogic.Interfaces;
using HandsForHire.Domain.Models.Reports;
using Microsoft.AspNetCore.Mvc;

namespace HandsForHire.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly IReportLogic _ReportLogic;

    public ReportsController(IReportLogic ReportLogic)
    {
        _ReportLogic = ReportLogic;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var reports = await _ReportLogic.GetAllAsync();
        return Ok(reports);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var report = await _ReportLogic.GetByIdAsync(id);

        if (report == null)
            return NotFound();

        return Ok(report);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateReportDto dto)
    {
        var created = await _ReportLogic.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateReportDto dto)
    {
        var updated = await _ReportLogic.UpdateAsync(id, dto);

        if (!updated)
            return NotFound();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _ReportLogic.DeleteAsync(id);

        if (!deleted)
            return NotFound();

        return NoContent();
    }
}
