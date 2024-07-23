using API.Data;
using API.DTO;
using API.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/course")]
public class CourseController : ControllerBase
{
    private readonly AcademyDbContext _context;
    private readonly IMapper _mapper;

    public CourseController(AcademyDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    private async Task<Course> GetCourseWithDetails(Guid courseId)
    {
        return await _context.Courses
            .Include(c => c.Teacher)
            .Include(c => c.CoursePrograms)
            .ThenInclude(p => p.ProgramDetails)
            .SingleOrDefaultAsync(c => c.Id == courseId);
    }

    private void UpdateCoursePrograms(Course currentCourse, CourseDto updatedCourse)
    {
        var currentProgramIds = currentCourse.CoursePrograms.Select(cp => cp.Id).ToList();
        var updatedProgramIds = updatedCourse.CoursePrograms.Select(cp => cp.Id).ToList();

        var programsToRemove = currentCourse.CoursePrograms
            .Where(cp => !updatedProgramIds.Contains(cp.Id))
            .ToList();
        var programsToAdd = updatedCourse.CoursePrograms
            .Where(cp => !currentProgramIds.Contains(cp.Id))
            .ToList();

        currentCourse.CoursePrograms.RemoveAll(cp => programsToRemove.Contains(cp));
        currentCourse.CoursePrograms.AddRange(_mapper.Map<List<CourseProgram>>(programsToAdd));

        var programsToEdit = updatedCourse.CoursePrograms
            .Where(cp => !programsToAdd.Select(p => p.Id)
            .Contains(cp.Id))
            .ToList();


        foreach (var updatedProgram in programsToEdit)
        {
            var currentProgram = currentCourse.CoursePrograms
                                              .FirstOrDefault(cp => cp.Id == updatedProgram.Id);
            if (currentProgram != null)
            {
                currentProgram.Name = updatedProgram.Name;
                foreach (var updatedProgramDetail in updatedProgram.ProgramDetails)
                {
                    var currentProgramDetail = currentProgram.ProgramDetails
                                                             .FirstOrDefault(pd => pd.Id == updatedProgramDetail.Id);
                    if (currentProgramDetail != null)
                    {
                        currentProgramDetail.Name = updatedProgramDetail.Name;
                    }
                }
            }
        }
    }

    private void UpdateProgramDetails(Course currentCourse, CourseDto updatedCourse)
    {
        var allCurrentDetails = currentCourse.CoursePrograms
            .Where(c => c.Id != new Guid())
            .SelectMany(cp => cp.ProgramDetails)
            .ToList();

        var allUpdatedDetails = updatedCourse.CoursePrograms
            .SelectMany(cp => cp.ProgramDetails)
            .ToList();

        var detailsToRemove = allCurrentDetails
            .Where(pd => !allUpdatedDetails.Select(ud => ud.Id)
            .Contains(pd.Id))
            .ToList();

        var detailsToAdd = allUpdatedDetails
            .Where(pd => !allCurrentDetails.Select(cd => cd.Id)
            .Contains(pd.Id))
            .ToList();

        detailsToAdd = _mapper.Map<List<ProgramDetail>>(detailsToAdd);

        foreach (var program in currentCourse.CoursePrograms)
        {
            program.ProgramDetails.RemoveAll(pd => detailsToRemove.Contains(pd));
            program.ProgramDetails.AddRange(detailsToAdd.Where(pd => pd.CourseProgramId == program.Id).ToList());
        }
    }

    [AllowAnonymous]
    [HttpGet("{id}")]
    public async Task<ActionResult<CourseDto>> GetCourse(Guid id)
    {
        var course = await GetCourseWithDetails(id);

        if (course is null) return NotFound("Course not found");
        var courseDto = new CourseDto();
        _mapper.Map(course, courseDto);

        courseDto.CoursePrograms = course.CoursePrograms;
        
        return Ok(courseDto);
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<List<Course>>> GetAllCourse()
    {
        var courses = await _context.Courses.ToListAsync();

        if (courses is null) return NotFound();

        return Ok(courses);
    }

    [HttpPost]
    public async Task<ActionResult> CreateCourse(CourseDto course)
    {
        var artist = await _context.Artists.FindAsync(course.TeacherId);
        if (artist is null) return NotFound("Teacher not found");

        var newCourse = _mapper.Map<Course>(course);
        newCourse.Teacher = artist;
        _context.Courses.Add(newCourse);
        var result = await _context.SaveChangesAsync() > 0;

        if (!result) return BadRequest("Can't create course right now, please try again later!");
        return Ok();
    }

    [HttpPut]
    public async Task<ActionResult> EditCourse(CourseDto updatedCourse)
    {
        var currentCourse = await GetCourseWithDetails(updatedCourse.Id);

        UpdateCoursePrograms(currentCourse, updatedCourse);
        UpdateProgramDetails(currentCourse, updatedCourse);

        if (updatedCourse.TeacherId != currentCourse.Teacher?.Id)
        {
            var teacher = await _context.Artists.FindAsync(updatedCourse.TeacherId);
            if (teacher is null) return BadRequest("Teacher not found");
            currentCourse.Teacher = teacher;
        }

        _mapper.Map(updatedCourse, currentCourse);
        _context.Entry(currentCourse).State = EntityState.Modified;
        var result = await _context.SaveChangesAsync() > 0;

        if (!result) return BadRequest("Can't edit this course right now, please try again later!");
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteCourse(Guid Id)
    {
        var course = await _context.Courses.FindAsync(Id);
        _context.Courses.Remove(course);

        var result = await _context.SaveChangesAsync() > 0;
        if (!result) return BadRequest("Can't delete this course right now, please try again later!");
        return Ok();
    }
}

// private void updateCourseProgramsAndDetail {
//     // var courseProgramsToRemove = currentCourse.CoursePrograms
//         //     //find courseProgram obj in currentCoursePrograms 
//         //     //that course.CoursePrograms does not have and return a list
//         //     .Where(cc => !course.CoursePrograms.Any(c => c.Id == cc.Id))
//         //     .Select(cc => cc.Id)
//         //     .ToList();

//         // currentCourse.CoursePrograms.RemoveAll(cp => courseProgramsToRemove.Contains(cp.Id));
//         // //add child (CourseProgram)
//         // //find coursePrograms that exists in course.CoursePrograms 
//         // //but not in currentCourse.CoursePrograms to add to the context
//         // //lists elements from course.CoursePrograms that are missing in 
//         // //currentCoursePrograms when comparing their Ids.
//         // var courseProgramsToAdd = course.CoursePrograms
//         //     .Where(c => !currentCourse.CoursePrograms.Any(cc => cc.Id == c.Id))
//         //     .ToList();

//         // currentCourse.CoursePrograms.AddRange(_mapper.Map<List<CourseProgram>>(courseProgramsToAdd));

//         // //edit course program
//         // var clientCourseToEdit = course.CoursePrograms
//         //     .Where(c => !courseProgramsToAdd.Any(cc => cc.Id == c.Id))
//         //     .ToList();

//         // foreach (var clientCourseProgram in clientCourseToEdit)
//         // {
//         //     var courseProgram = currentCourse.CoursePrograms
//         //                                      .FirstOrDefault(cp => cp.Id == clientCourseProgram.Id);
//         //     if (courseProgram != null)
//         //     {
//         //         courseProgram.Name = clientCourseProgram.Name;
//         //         foreach (var clientProgramDetail in clientCourseProgram.ProgramDetails)
//         //         {
//         //             var currentProgramDetail = courseProgram.ProgramDetails
//         //                                                     .FirstOrDefault(pd => pd.Id == clientProgramDetail.Id);
//         //             if (currentProgramDetail != null)
//         //             {
//         //                 currentProgramDetail.Name = clientProgramDetail.Name;
//         //             }
//         //         }
//         //     }
//         // }
// ////remove program detail 
//         ////add program detail
//         // var currentProgramDetails = new List<ProgramDetail>();
//         // var clientProgramDetails = new List<ProgramDetail>();

//         // currentProgramDetails.AddRange(currentCourse.CoursePrograms
//         //     .Where(c => c.Id != new Guid())
//         //     .SelectMany(cp => cp.ProgramDetails));

//         // clientProgramDetails.AddRange(course.CoursePrograms.SelectMany(cp => cp.ProgramDetails));
//         // var programDetailToRemove = currentProgramDetails
//         //                             .Where(current => !clientProgramDetails.Any(client => client.Id == current.Id))
//         //                             .Select(current => current.Id)
//         //                             .ToList();

//         // var programDetailToAdd = clientProgramDetails
//         //                             .Where(client => !currentProgramDetails.Any(current => current.Id == client.Id))
//         //                             .ToList();
//         // programDetailToAdd = _mapper.Map<List<ProgramDetail>>(programDetailToAdd);

//         // foreach (var courseProgram in currentCourse.CoursePrograms)
//         // {
//         //     courseProgram.ProgramDetails.RemoveAll(g => programDetailToRemove.Contains(g.Id));

//         //     courseProgram.ProgramDetails
//         //         .AddRange(programDetailToAdd.Where(pd => pd.CourseProgramId == courseProgram.Id).ToList());
//         // }
// }
