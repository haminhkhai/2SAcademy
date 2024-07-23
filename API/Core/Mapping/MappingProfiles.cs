using API.DTO;
using API.Entities;
using AutoMapper;

namespace API.Core.Mapping;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<CustomerDto, Customer>();

        CreateMap<Customer, CustomerDto>()
            .ForMember(dest => dest.CourseId, m => m.MapFrom(source => source.Course.Id))
            .ForMember(dest => dest.CourseName, m => m.MapFrom(source => source.Course.Name));

        CreateMap<Artist, Artist>();

        CreateMap<Gallery, Gallery>();

        CreateMap<Blog, Blog>();

        CreateMap<CourseDto, Course>()
            .ForMember(dest => dest.Teacher, opt => opt.Ignore())
            .ForMember(dest => dest.CoursePrograms, opt => opt.Ignore());
            // .ForMember(dest => dest.Teacher, 
            //     m => m.MapFrom(source => new Artist{Id = source.TeacherId, Name = source.TeacherName}));

        CreateMap<Course, CourseDto>()
            .ForMember(dest => dest.CoursePrograms, opt => opt.Ignore())
            .ForMember(dest => dest.TeacherId, m => m.MapFrom(source => source.Teacher.Id))
            .ForMember(dest => dest.TeacherName, m => m.MapFrom(source => source.Teacher.Name));

        CreateMap<Course, Course>()
            .ForMember(dest => dest.CoursePrograms, opt => opt.Ignore());

        CreateMap<CourseProgram, CourseProgram>()
            .ForMember(dest => dest.Id, opt => opt.Ignore());

        CreateMap<ProgramDetail, ProgramDetail>()
            .ForMember(dest => dest.Id, opt => opt.Ignore());


    }
}
