using HandsForHire.BusinessLogic.Interfaces;
using HandsForHire.Domain.Models.Users;
using Microsoft.AspNetCore.Mvc;

namespace HandsForHire.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserLogic _UserLogic;

    public UsersController(IUserLogic UserLogic)
    {
        _UserLogic = UserLogic;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _UserLogic.GetAllAsync();
        return Ok(users);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var user = await _UserLogic.GetByIdAsync(id);

        if (user == null)
            return NotFound();

        return Ok(user);
    }

    [HttpGet("by-email/{email}")]
    public async Task<IActionResult> GetByEmail(string email)
    {
        var user = await _UserLogic.GetByEmailAsync(email);

        if (user == null)
            return NotFound();

        return Ok(user);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateUserDto dto)
    {
        var createdUser = await _UserLogic.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = createdUser.Id }, createdUser);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterUserDto dto)
    {
        try
        {
            var createdUser = await _UserLogic.RegisterAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = createdUser.Id }, createdUser);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginUserDto dto)
    {
        try
        {
            var user = await _UserLogic.LoginAsync(dto);

            if (user == null)
                return Unauthorized("Email or password is incorrect.");

            return Ok(user);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword(ChangePasswordDto dto)
    {
        try
        {
            var changed = await _UserLogic.ChangePasswordAsync(dto);

            if (!changed)
                return BadRequest("Current password is incorrect.");

            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateUserDto dto)
    {
        bool updated;
        try
        {
            updated = await _UserLogic.UpdateAsync(id, dto);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }

        if (!updated)
            return NotFound();

        return NoContent();
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> SetStatus(int id, SetUserStatusDto dto)
    {
        var updated = await _UserLogic.SetStatusAsync(id, dto.Status);

        if (!updated)
            return NotFound();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _UserLogic.DeleteAsync(id);

        if (!deleted)
            return NotFound();

        return NoContent();
    }
}
