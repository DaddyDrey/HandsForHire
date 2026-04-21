using HandsForHire.BusinessLogic.Interfaces;
using HandsForHire.Domain.Models.Pros;
using Microsoft.AspNetCore.Mvc;

namespace HandsForHire.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProsController : ControllerBase
{
    private readonly IProLogic _ProLogic;

    public ProsController(IProLogic ProLogic)
    {
        _ProLogic = ProLogic;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var pros = await _ProLogic.GetAllAsync();
        return Ok(pros);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var pro = await _ProLogic.GetByIdAsync(id);

        if (pro == null)
            return NotFound();

        return Ok(pro);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateProDto dto)
    {
        var createdPro = await _ProLogic.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = createdPro.Id }, createdPro);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateProDto dto)
    {
        var updated = await _ProLogic.UpdateAsync(id, dto);

        if (!updated)
            return NotFound();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _ProLogic.DeleteAsync(id);

        if (!deleted)
            return NotFound();

        return NoContent();
    }
}
