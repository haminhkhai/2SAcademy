namespace API.Entities;

public class Gallery
{
    public Guid Id { get; set; }
    public string PublicId { get; set; }
    public string Url { get; set; }
    public string Caption { get; set; }
    public int Width { get; set; }
    public int Height { get; set; }
}
