using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class AcademyDbContext : DbContext
{
    public AcademyDbContext(DbContextOptions options) : base(options)
    {

    }

    public DbSet<User> Users { get; set; }
    public DbSet<Artist> Artists { get; set; }
    public DbSet<Course> Courses { get; set; }
    public DbSet<CourseProgram> CoursePrograms { get; set; }
    public DbSet<ProgramDetail> ProgramDetail { get; set; }
    public DbSet<Customer> Customers { get; set; }
    public DbSet<Gallery> Galleries { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Blog> Blogs { get; set; }
    public DbSet<Review> Reviews { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // modelBuilder.Entity<Course>()
        //     .HasMany(cp => cp.CoursePrograms)
        //     .WithOne(c => c.Course)
        //     .HasForeignKey(cp => cp.CourseId);

        // modelBuilder.Entity<CourseProgram>()
        //     .HasMany(pd => pd.ProgramDetails)
        //     .WithOne(cp => cp.CourseProgram)
        //     .HasForeignKey(pd => pd.CourseProgramId);
    }
}
