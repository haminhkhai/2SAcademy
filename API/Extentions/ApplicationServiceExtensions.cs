using API.Core.Photo;
using API.Data;
using API.DTO;
using dotenv.net;
using Microsoft.EntityFrameworkCore;

namespace API.Extentions;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
    {
        services.AddDbContext<AcademyDbContext>(opt =>
        {
            // opt.UseNpgsql(config.GetConnectionString("DefaultConnection"));
            opt.UseSqlServer(config.GetConnectionString("DefaultConnection"));
            // mssql connection string
            // "DefaultConnection": "Server=112.78.2.80;Database=min84469_academy;User Id=min84469_minhkhai;Password=Minhkhai123;TrustServerCertificate=True"
            // local postgres connection string
            // "DefaultConnection": "Server=localhost:5432;User Id=admin;Password=secret;database=2sacademy"
        });

        services.AddCors(opt =>
         {
             opt.AddPolicy("CorsPolicy", policy =>
             {
                 policy.AllowAnyMethod().AllowAnyHeader().WithOrigins("http://localhost:3000");
             });
         });

        //take a look for any class that derive from the profile class and register the mappings
        services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
        // DotEnv.Load(options: new DotEnvOptions(probeForEnv: true));
        // services.AddScoped<IPhotoAccessor, PhotoAccessor>(provider => new PhotoAccessor(Environment.GetEnvironmentVariable("CLOUDINARY_URL")));
        services.AddScoped<IPhotoAccessor, PhotoAccessor>();
        services.Configure<CloudinarySettings>(config.GetSection("Cloudinary"));
        return services;
    }
}
