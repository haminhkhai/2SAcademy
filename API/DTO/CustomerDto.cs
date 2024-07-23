namespace API.DTO;

public class CustomerDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string Tel { get; set; }
    public string Description { get; set; } 
    public DateTime RegDate { get; set; } = DateTime.UtcNow;
    public Guid CourseId { get; set; }
    public string CourseName { get; set; }
}
