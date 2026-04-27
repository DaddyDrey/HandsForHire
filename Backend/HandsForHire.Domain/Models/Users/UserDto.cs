using HandsForHire.Domain.Entities;

namespace HandsForHire.Domain.Models.Users;

public class UserDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public UserStatus Status { get; set; } = UserStatus.Active;
}