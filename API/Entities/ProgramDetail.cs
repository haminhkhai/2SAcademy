namespace API;

public class ProgramDetail
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public Guid CourseProgramId { get; set; }
    public CourseProgram CourseProgram { get; set; }
}
