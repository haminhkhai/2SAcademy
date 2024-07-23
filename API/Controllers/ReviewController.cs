using API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/review")]
public class ReviewController : ControllerBase
{
    private readonly AcademyDbContext _context;

    public ReviewController(AcademyDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult> GetAllReviews()
    {
        var reviews = await _context.Reviews
            .Include(r => r.Artist)
            .ToListAsync();
        return Ok(reviews);
    }
}