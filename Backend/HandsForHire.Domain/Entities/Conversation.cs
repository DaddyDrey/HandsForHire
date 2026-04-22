namespace HandsForHire.Domain.Entities;

public class Conversation
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int ProId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime LastMessageAt { get; set; }

    public ICollection<Message> Messages { get; set; } = new List<Message>();
}
