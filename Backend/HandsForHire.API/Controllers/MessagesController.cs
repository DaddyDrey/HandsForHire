using HandsForHire.BusinessLogic.Interfaces;
using HandsForHire.Domain.Entities;
using HandsForHire.Domain.Models.Messages;
using System.Collections.Concurrent;
using Microsoft.AspNetCore.Mvc;

namespace HandsForHire.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MessagesController : ControllerBase
{
    private static readonly ConcurrentDictionary<string, DateTimeOffset> TypingSignals = new();
    private static readonly TimeSpan TypingWindow = TimeSpan.FromSeconds(4);
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

    [HttpPost("conversation/{conversationId}/read/{viewer}")]
    public async Task<IActionResult> MarkRead(int conversationId, MessageSender viewer)
    {
        await _MessageLogic.MarkConversationReadAsync(conversationId, viewer);
        return NoContent();
    }

    [HttpPost("conversation/{conversationId}/typing/{viewer}")]
    public IActionResult SetTyping(int conversationId, MessageSender viewer)
    {
        TypingSignals[TypingKey(conversationId, viewer)] = DateTimeOffset.UtcNow;
        return NoContent();
    }

    [HttpGet("conversation/{conversationId}/typing/{viewer}")]
    public IActionResult GetOtherTyping(int conversationId, MessageSender viewer)
    {
        var other = viewer == MessageSender.User ? MessageSender.Pro : MessageSender.User;
        var isTyping =
            TypingSignals.TryGetValue(TypingKey(conversationId, other), out var lastSeen) &&
            DateTimeOffset.UtcNow - lastSeen <= TypingWindow;

        return Ok(new { isTyping });
    }

    private static string TypingKey(int conversationId, MessageSender sender)
    {
        return $"{conversationId}:{sender}";
    }
}
