using HandsForHire.BusinessLogic.Interfaces;
using HandsForHire.Domain.Models.Conversations;
using Microsoft.AspNetCore.Mvc;

namespace HandsForHire.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ConversationsController : ControllerBase
{
    private readonly IConversationLogic _ConversationLogic;

    public ConversationsController(IConversationLogic ConversationLogic)
    {
        _ConversationLogic = ConversationLogic;
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetForUser(int userId)
    {
        var conversations = await _ConversationLogic.GetForUserAsync(userId);
        return Ok(conversations);
    }

    [HttpGet("pro/{proId}")]
    public async Task<IActionResult> GetForPro(int proId)
    {
        var conversations = await _ConversationLogic.GetForProAsync(proId);
        return Ok(conversations);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var conversation = await _ConversationLogic.GetByIdAsync(id);

        if (conversation == null)
            return NotFound();

        return Ok(conversation);
    }

    [HttpPost]
    public async Task<IActionResult> Ensure(CreateConversationDto dto)
    {
        var conversation = await _ConversationLogic.EnsureAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = conversation.Id }, conversation);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _ConversationLogic.DeleteAsync(id);

        if (!deleted)
            return NotFound();

        return NoContent();
    }
}
