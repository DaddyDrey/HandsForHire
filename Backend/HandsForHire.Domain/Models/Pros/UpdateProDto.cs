namespace HandsForHire.Domain.Models.Pros;

public class UpdateProDto
{
    public string FullName { get; set; } = string.Empty;
    public int BirthYear { get; set; }
    public string Trade { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public decimal HourlyRate { get; set; }
    public string Description { get; set; } = string.Empty;
}
