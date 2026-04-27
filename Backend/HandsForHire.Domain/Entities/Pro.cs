namespace HandsForHire.Domain.Entities;

public enum ProStatus
{
    Pending = 0,
    Verified = 1,
    Suspended = 2
}

public class Pro
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Trade { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public decimal HourlyRate { get; set; }
    public ProStatus Status { get; set; } = ProStatus.Pending;
}