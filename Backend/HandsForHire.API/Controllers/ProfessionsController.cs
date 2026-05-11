using HandsForHire.BusinessLogic.Interfaces;
using HandsForHire.Domain.Models.Professions;
using Microsoft.AspNetCore.Mvc;

namespace HandsForHire.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProfessionsController : ControllerBase
{
    private readonly IProfessionLogic _professionLogic;

    public ProfessionsController(IProfessionLogic professionLogic)
    {
        _professionLogic = professionLogic;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var professions = await _professionLogic.GetAllAsync();
        return Ok(professions);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var profession = await _professionLogic.GetByIdAsync(id);

        if (profession == null)
            return NotFound();

        return Ok(profession);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateProfessionDto dto)
    {
        try
        {
            var createdProfession = await _professionLogic.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = createdProfession.Id }, createdProfession);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _professionLogic.DeleteAsync(id);

        if (!deleted)
            return NotFound();

        return NoContent();
    }
}
