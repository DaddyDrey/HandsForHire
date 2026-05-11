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
        try
        {
            var createdPro = await _ProLogic.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = createdPro.Id }, createdPro);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateProDto dto)
    {
        bool updated;
        try
        {
            updated = await _ProLogic.UpdateAsync(id, dto);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }

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
