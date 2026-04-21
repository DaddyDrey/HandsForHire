namespace HandsForHire.Domain.Models.Reviews;

public class ReviewDto
{
    public int Id { get; set; }
    public int ProId { get; set; }
    public string ReviewerName { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
}