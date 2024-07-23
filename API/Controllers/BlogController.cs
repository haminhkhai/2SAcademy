using API.Data;
using API.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/blog")]
public class BlogController : ControllerBase
{
    private readonly AcademyDbContext _context;
    private readonly IMapper _mapper;

    public BlogController(AcademyDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpPost]
    public async Task<ActionResult> CreateBlog(Blog blog)
    {
        var category = await _context.Categories.FindAsync(blog.Category.Id);
        if (category is null) return NotFound("Category not found");

        blog.Category = category;
        blog.CreatedDate = DateTime.UtcNow;

        _context.Blogs.Add(blog);
        var result = await _context.SaveChangesAsync() > 0;

        if (!result) return BadRequest("Can't create blog right now, please try again later!");
        return Ok();
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<List<Blog>>> GetAllBlog()
    {
        var blogs = await _context.Blogs
            .OrderByDescending(b => b.CreatedDate)
            .Include(b => b.Category)
            .ToListAsync();
        return Ok(blogs);
    }

    [AllowAnonymous]
    [HttpGet("{id}/topfive")]
    public async Task<ActionResult<List<Blog>>> GetTop5Blog(Guid? id)
    {
        var blogs = await _context.Blogs
                .Select(b => 
                    new { b.Id, b.Title, b.ThumbPublicId, b.ThumbUrl, b.Category, b.CreatedDate })
                // .Include(b => b.Category)
                .OrderByDescending(b => b.CreatedDate)
                .Where(b => b.Id != id)
                .Take(5)
                .ToListAsync();
        return Ok(blogs);
    }

    [AllowAnonymous]
    [HttpGet("{id}")]
    public async Task<ActionResult<Blog>> GetBlog(Guid id)
    {
        var blog = await _context.Blogs
            .Include(c => c.Category)
            .SingleOrDefaultAsync(b => b.Id == id);
        if (blog is null) return NotFound("Blog not found");

        return Ok(blog);
    }

    [HttpPut]
    public async Task<ActionResult> EditBlog(Blog blog)
    {
        var currentBlog = await _context.Blogs.FindAsync(blog.Id);
        if (currentBlog is null) return NotFound("Blog not found");

        _mapper.Map(blog, currentBlog);

        var result = await _context.SaveChangesAsync() > 0;
        if (!result) return BadRequest("Cant edit this blog right now, please try again later!");

        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteBlog(Guid id)
    {
        var blog = await _context.Blogs.FindAsync(id);
        if (blog is null) return NotFound("Blog not found");

        _context.Blogs.Remove(blog);
        var result = await _context.SaveChangesAsync() > 0;
        if (!result) return BadRequest("Cant delete this blog right now, please try again later!");

        return Ok();
    }
}
