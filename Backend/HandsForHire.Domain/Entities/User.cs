namespace HandsForHire.Domain.Entities;

public enum UserStatus
{
    Active = 0,
    Suspended = 1
}

public class User
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public UserStatus Status { get; set; } = UserStatus.Active;
}