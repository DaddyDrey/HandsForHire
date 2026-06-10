using HandsForHire.BusinessLogic.Interfaces;
using HandsForHire.DataAccesLayer.Context;
using HandsForHire.Domain.Models.Users;
using HandsForHire.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace HandsForHire.BusinessLogic.Structure;

public class UserLogic : IUserLogic
{
    private readonly AppDbContext _context;
    private const int PasswordSaltSize = 16;
    private const int PasswordHashSize = 32;
    private const int PasswordIterations = 100_000;

    public UserLogic(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<UserDto>> GetAllAsync()
    {
        var users = await _context.Users.ToListAsync();
        return users.Select(ToDto);
    }

    public async Task<UserDto?> GetByIdAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
            return null;

        return ToDto(user);
    }

    public async Task<UserDto?> GetByEmailAsync(string email)
    {
        var normalized = NormalizeEmail(email);
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == normalized);

        if (user == null)
            return null;

        return ToDto(user);
    }

    public async Task<UserDto> CreateAsync(CreateUserDto dto)
    {
        var normalizedEmail = NormalizeEmail(dto.Email);
        var existing = await _context.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail);

        if (existing != null)
            throw new InvalidOperationException("An account with this email already exists.");

        var user = new User
        {
            FullName = dto.FullName.Trim(),
            Email = normalizedEmail
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return ToDto(user);
    }

    public async Task<UserDto> RegisterAsync(RegisterUserDto dto)
    {
        var normalizedEmail = NormalizeEmail(dto.Email);
        ValidatePassword(dto.Password);

        var existing = await _context.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail);

        if (existing != null && !string.IsNullOrWhiteSpace(existing.PasswordHash))
            throw new InvalidOperationException("An account with this email already exists.");

        var user = existing ?? new User { Email = normalizedEmail };
        user.FullName = string.IsNullOrWhiteSpace(dto.FullName)
            ? normalizedEmail.Split('@')[0]
            : dto.FullName.Trim();
        user.PasswordHash = HashPassword(dto.Password);
        user.Status = UserStatus.Active;

        if (existing == null)
            _context.Users.Add(user);

        await _context.SaveChangesAsync();
        return ToDto(user);
    }

    public async Task<UserDto?> LoginAsync(LoginUserDto dto)
    {
        var normalizedEmail = NormalizeEmail(dto.Email);
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail);

        if (user == null || string.IsNullOrWhiteSpace(user.PasswordHash))
            return null;

        return VerifyPassword(dto.Password, user.PasswordHash) ? ToDto(user) : null;
    }

    public async Task<bool> ChangePasswordAsync(ChangePasswordDto dto)
    {
        var normalizedEmail = NormalizeEmail(dto.Email);
        ValidatePassword(dto.NewPassword);

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail);

        if (user == null || string.IsNullOrWhiteSpace(user.PasswordHash))
            return false;

        if (!VerifyPassword(dto.CurrentPassword, user.PasswordHash))
            return false;

        user.PasswordHash = HashPassword(dto.NewPassword);
        await _context.SaveChangesAsync();
        return true;
    }

    private static UserDto ToDto(User user)
    {
        return new UserDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            City = user.City,
            BirthYear = user.BirthYear,
            PhoneNumber = user.PhoneNumber,
            Status = user.Status,
            WarningCount = user.WarningCount
        };
    }

    private static string NormalizeEmail(string email)
    {
        return email.Trim().ToLower();
    }

    private static void ValidatePassword(string password)
    {
        if (password.Length < 6)
            throw new InvalidOperationException("Password must be at least 6 characters.");
    }

    private static string HashPassword(string password)
    {
        var salt = RandomNumberGenerator.GetBytes(PasswordSaltSize);
        var hash = Rfc2898DeriveBytes.Pbkdf2(
            password,
            salt,
            PasswordIterations,
            HashAlgorithmName.SHA256,
            PasswordHashSize);

        return string.Join(
            ".",
            "v1",
            PasswordIterations,
            Convert.ToBase64String(salt),
            Convert.ToBase64String(hash));
    }

    private static bool VerifyPassword(string password, string storedHash)
    {
        var parts = storedHash.Split('.');
        if (parts.Length != 4 || parts[0] != "v1")
            return false;

        if (!int.TryParse(parts[1], out var iterations))
            return false;

        try
        {
            var salt = Convert.FromBase64String(parts[2]);
            var expected = Convert.FromBase64String(parts[3]);
            var actual = Rfc2898DeriveBytes.Pbkdf2(
                password,
                salt,
                iterations,
                HashAlgorithmName.SHA256,
                expected.Length);

            return CryptographicOperations.FixedTimeEquals(actual, expected);
        }
        catch (FormatException)
        {
            return false;
        }
    }

    public async Task<bool> UpdateAsync(int id, UpdateUserDto dto)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
            return false;

        var normalizedEmail = NormalizeEmail(dto.Email);
        var currentEmail = NormalizeEmail(user.Email);
        var emailTaken = currentEmail != normalizedEmail && await _context.Users
            .AnyAsync(u => u.Id != id && u.Email.ToLower() == normalizedEmail);

        if (emailTaken)
            throw new InvalidOperationException("An account with this email already exists.");

        user.FullName = dto.FullName.Trim();
        user.Email = normalizedEmail;
        user.City = dto.City.Trim();
        user.BirthYear = dto.BirthYear;
        user.PhoneNumber = dto.PhoneNumber.Trim();

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> SetStatusAsync(int id, UserStatus status)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
            return false;

        user.Status = status;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
            return false;

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return true;
    }
}

