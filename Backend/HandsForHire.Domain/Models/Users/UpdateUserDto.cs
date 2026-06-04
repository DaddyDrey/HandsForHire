namespace HandsForHire.Domain.Models.Users;

public class UpdateUserDto
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public int? BirthYear { get; set; }
    public string PhoneNumber { get; set; } = string.Empty;
}
