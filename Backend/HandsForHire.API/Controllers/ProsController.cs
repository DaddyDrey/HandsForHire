using HandsForHire.BusinessLayer.Interfaces;
using HandsForHire.Domain.DTOs.Pros;
using Microsoft.AspNetCore.Mvc;

namespace HandsForHire.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProsController : ControllerBase
{
    private readonly IProService _proService;

    public ProsController(IProService proService)
    {
        _proService = proService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var pros = await _proService.GetAllAsync();
        return Ok(pros);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var pro = await _proService.GetByIdAsync(id);

        if (pro == null)
            return NotFound();

        return Ok(pro);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateProDto dto)
    {
        var createdPro = await _proService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = createdPro.Id }, createdPro);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateProDto dto)
    {
        var updated = await _proService.UpdateAsync(id, dto);

        if (!updated)
            return NotFound();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _proService.DeleteAsync(id);

        if (!deleted)
            return NotFound();

        return NoContent();
    }
}