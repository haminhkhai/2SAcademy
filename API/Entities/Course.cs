namespace API.Entities;

public class Course
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public int Price { get; set; }
    public string Description { get; set; }
    public int Lecture { get; set; }
    public string Level { get; set; }
    public string ThumbPublicId { get; set; }
    public string ThumbUrl { get; set; }
    public Artist Teacher { get; set; }
    public string ScheduleDate { get; set; }  
    public string ScheduleTime { get; set; }
    public List<CourseProgram> CoursePrograms { get; set; }
}
