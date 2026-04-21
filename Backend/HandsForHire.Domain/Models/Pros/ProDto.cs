namespace HandsForHire.Domain.Models.Pros;

public class ProDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Trade { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public decimal HourlyRate { get; set; }
}