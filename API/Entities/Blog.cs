namespace API.Entities;

public class Blog
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public DateTime CreatedDate { get; set; }
    public Category Category { get; set; }
    // [Column(TypeName = "jsonb")]
    public string Content { get; set; }
    public string ThumbPublicId { get; set; }
    public string ThumbUrl { get; set; }
}
