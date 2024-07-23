using API.Data;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API;

public class DbInitializer
{
    public static void InitDb(WebApplication app)
    {
        using var scope = app.Services.CreateScope();

        SeedData(scope.ServiceProvider.GetService<AcademyDbContext>());
    }

    private static void SeedData(AcademyDbContext context)
    {
        context.Database.Migrate();

        if (context.Courses.Any())
        {
            System.Console.WriteLine("Already have data - no need to seed");
            return;
        }

        var admin = new User() { Password = "Pa$$w0rd", Username = "admin" };

        var categories = new List<Category>(){
            new Category {
                Name = "Nightlife"
            },
            new Category {
                Name = "DJ Tips"
            },
            new Category {
                Name = "Lessons"
            }
        };

        var galleries = new List<Gallery>(){
            new Gallery {
                PublicId = "2smusic/g1irzuxhrlsmzuoreksh",
                Url = "https://res.cloudinary.com/de04qqilt/image/upload/v1717688541/2smusic/g1irzuxhrlsmzuoreksh.png",
                Caption = "2s music room",
                Width = 2048,
                Height = 1365,
            },
            new Gallery {
                PublicId = "2smusic/scl3pavfy9ilotcrkqhe",
                Url = "https://res.cloudinary.com/de04qqilt/image/upload/v1717688539/2smusic/scl3pavfy9ilotcrkqhe.png",
                Caption = "2s music room2",
                Width = 2048,
                Height = 1365,
            }
        };

        var artists = new List<Artist>() {
            new Artist {
                Id = new Guid("f12a437e-c4fd-42f6-aed2-738283af1b0f"),
                Name = "DJ Feliz",
                Description = "Best local DJ",
                ThumbUrl = "/img/artist/feliz.png"
            },
            new Artist {
                Id = new Guid("fd9152e9-de62-49de-b0e7-8549d5ef1335"),
                Name = "DJ Skrillex",
                Description = "Best global DJ",
                ThumbUrl = "/img/artist/skrillex.jpg"
            },
            new Artist {
                Id = new Guid("6d9a5b0f-92fd-4157-8a0e-9d52897f859e"),
                Name = "DJ Bảo",
                Description = "Best global DJ",
                ThumbUrl = "/img/artist/feliz2.jpg"
            }
        };

        var reviews = new List<Review>() {
            new Review {
                Artist = artists[0],
                Rating = 5,
                Content = "Học DJ với 2s Academy. Các khoá học của chúng tôi đã được phát " +
                    "triển qua nhiều năm kinh nghiệm thực tế trong studio, " +
                    "trên sân khấu và trong lớp học. Tại 2s Academy, chúng tôi " +
                    "tin rằng bằng hành động, bạn học nhanh hơn, ghi nhớ kiến thức lâu hơn."
            },
            new Review {
                Artist = artists[1],
                Rating = 5,
                Content = "Học DJ với 2s Academy. Các khoá học của chúng tôi đã được phát " +
                    "triển qua nhiều năm kinh nghiệm thực tế trong studio, " +
                    "trên sân khấu và trong lớp học. Tại 2s Academy, chúng tôi " +
                    "tin rằng bằng hành động, bạn học nhanh hơn, ghi nhớ kiến thức lâu hơn."
            },
            new Review {
                Artist = artists[2],
                Rating = 5,
                Content = "Học DJ với 2s Academy. Các khoá học của chúng tôi đã được phát " +
                    "triển qua nhiều năm kinh nghiệm thực tế trong studio, " +
                    "trên sân khấu và trong lớp học. Tại 2s Academy, chúng tôi " +
                    "tin rằng bằng hành động, bạn học nhanh hơn, ghi nhớ kiến thức lâu hơn."
            }
        };

        var courses = new List<Course>() {
            new Course {
                Name = "Beginner Course",
                Price = 8500000,
                Description = "Học DJ với 2s Academy. Các khoá học của chúng tôi đã được phát triển qua nhiều năm kinh nghiệm thực tế trong studio, trên sân khấu và trong lớp học",
                Lecture = 12,
                Level = "Beginner",
                ScheduleDate = "Thứ 3, Thứ 6",
                ScheduleTime = "19:00 - 21:30"
            },
            new Course {
                Name = "Intermediate Course",
                Price = 10000000,
                Description = "Học DJ với 2s Academy. Các khoá học của chúng tôi đã được phát triển qua nhiều năm kinh nghiệm thực tế trong studio, trên sân khấu và trong lớp học",
                Lecture = 14,
                Level = "Beginner",
                ScheduleDate = "Thứ 2, Thứ 5",
                ScheduleTime = "19:00 - 21:30"
            },
            new Course {
                Name = "Advance Course",
                Price = 12000000,
                Description = "Học DJ với 2s Academy. Các khoá học của chúng tôi đã được phát triển qua nhiều năm kinh nghiệm thực tế trong studio, trên sân khấu và trong lớp học",
                Lecture = 16,
                Level = "Advance",
                ScheduleDate = "Thứ 4, Chủ Nhật",
                ScheduleTime = "8:00 - 11:30"
            }
        };

        context.Add(admin);
        context.AddRange(categories);
        context.AddRange(galleries);
        context.AddRange(artists);
        context.AddRange(reviews);
        context.AddRange(courses);
        context.SaveChanges();
        System.Console.WriteLine("Data seeded");
    }
}
