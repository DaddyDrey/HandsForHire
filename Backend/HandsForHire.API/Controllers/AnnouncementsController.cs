using HandsForHire.BusinessLogic.Interfaces;
using HandsForHire.Domain.Models.Announcements;
using Microsoft.AspNetCore.Mvc;

namespace HandsForHire.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnnouncementsController : ControllerBase
{
    private readonly IAnnouncementLogic _AnnouncementLogic;

    public AnnouncementsController(IAnnouncementLogic AnnouncementLogic)
    {
        _AnnouncementLogic = AnnouncementLogic;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var announcements = await _AnnouncementLogic.GetAllAsync();
        return Ok(announcements);
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetForUser(int userId)
    {
        var announcements = await _AnnouncementLogic.GetForUserAsync(userId);
        return Ok(announcements);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var announcement = await _AnnouncementLogic.GetByIdAsync(id);

        if (announcement == null)
            return NotFound();

        return Ok(announcement);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateAnnouncementDto dto)
    {
        var created = await _AnnouncementLogic.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateAnnouncementDto dto)
    {
        var updated = await _AnnouncementLogic.UpdateAsync(id, dto);

        if (!updated)
            return NotFound();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _AnnouncementLogic.DeleteAsync(id);

        if (!deleted)
            return NotFound();

        return NoContent();
    }
}
