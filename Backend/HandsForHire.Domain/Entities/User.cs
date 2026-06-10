namespace HandsForHire.Domain.Entities;

public enum UserStatus
{
    Active = 0,
    Suspended = 1,
    Verified = 2
}

public class User
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public int? BirthYear { get; set; }
    public string PhoneNumber { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserStatus Status { get; set; } = UserStatus.Active;
    public int WarningCount { get; set; }
}
