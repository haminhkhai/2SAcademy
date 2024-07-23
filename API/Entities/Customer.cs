namespace API.Entities;

public class Customer
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string Tel { get; set; }
    public Course Course { get; set; }
    public string Description { get; set; }
    public DateTime RegDate { get; set; }

}
