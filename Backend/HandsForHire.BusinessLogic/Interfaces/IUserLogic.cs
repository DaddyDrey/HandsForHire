using HandsForHire.Domain.Entities;
using HandsForHire.Domain.Models.Users;

namespace HandsForHire.BusinessLogic.Interfaces;

public interface IUserLogic
{
    Task<IEnumerable<UserDto>> GetAllAsync();
    Task<UserDto?> GetByIdAsync(int id);
    Task<UserDto?> GetByEmailAsync(string email);
    Task<UserDto> CreateAsync(CreateUserDto dto);
    Task<bool> UpdateAsync(int id, UpdateUserDto dto);
    Task<bool> SetStatusAsync(int id, UserStatus status);
    Task<bool> DeleteAsync(int id);
}