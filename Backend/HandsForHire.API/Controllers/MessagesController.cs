using HandsForHire.BusinessLogic.Interfaces;
using HandsForHire.Domain.Models.Messages;
using Microsoft.AspNetCore.Mvc;

namespace HandsForHire.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MessagesController : ControllerBase
{
    private readonly IMessageLogic _MessageLogic;

    public MessagesController(IMessageLogic MessageLogic)
    {
        _MessageLogic = MessageLogic;
    }

    [HttpGet("conversation/{conversationId}")]
    public async Task<IActionResult> GetByConversation(int conversationId)
    {
        var messages = await _MessageLogic.GetByConversationAsync(conversationId);
        return Ok(messages);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateMessageDto dto)
    {
        var message = await _MessageLogic.CreateAsync(dto);
        return Created(string.Empty, message);
    }

    [HttpPost("conversation/{conversationId}/read")]
    public async Task<IActionResult> MarkRead(int conversationId)
    {
        await _MessageLogic.MarkConversationReadAsync(conversationId);
        return NoContent();
    }
}
