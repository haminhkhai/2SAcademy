using API.Entities;

namespace API;

public class CourseProgram
{
    public Guid Id { get; set; }
    public int Orders { get; set; }
    public string Name { get; set; }
    public Guid CourseId { get; set; }
    public Course Course { get; set; }
    public List<ProgramDetail> ProgramDetails { get; set; }
}
