namespace HandsForHire.Domain.DTOs.Reviews;

public class UpdateReviewDto
{
    public int ProId { get; set; }
    public string ReviewerName { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
}