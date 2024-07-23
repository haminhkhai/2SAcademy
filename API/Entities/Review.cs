namespace API.Entities;

public class Review {
    public Guid Id { get; set; }
    public Artist Artist { get; set; }
    public float Rating { get; set; }
    public string Content { get; set; }
}