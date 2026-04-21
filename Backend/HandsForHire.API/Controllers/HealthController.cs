using Microsoft.AspNetCore.Mvc;

namespace HandsForHire.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok("API is running");
    }

    [HttpGet("error")]
    public IActionResult Error()
    {
        return StatusCode(500, "Test error");
    }
}
