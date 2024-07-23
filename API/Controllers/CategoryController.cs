using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/category")]
public class CategoryController : ControllerBase
{
    private readonly AcademyDbContext _context;

    public CategoryController(AcademyDbContext context)
    {
        _context = context;
    }
    [HttpPost]
    public async Task<ActionResult> CreateCategory(Category category)
    {
        if (await _context.Categories.AnyAsync(c => c.Name.ToLower() == category.Name.ToLower()))
        {
            ModelState.AddModelError("name", "Category name taken");
            return ValidationProblem();
        }
        _context.Categories.Add(category);
        var result = await _context.SaveChangesAsync() > 0;

        if (!result) return BadRequest("Can't create category right now, please try again later!");
        return Ok();
    }

    [HttpGet]
    public async Task<ActionResult<List<Category>>> GetAllCategory()
    {
        return Ok(await _context.Categories.ToListAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Category>> GetCategory(Guid id)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category is null) return NotFound("Category not found");
        return Ok(category);
    }

    [AllowAnonymous]
    [HttpGet("name/{name}")]
    public async Task<ActionResult<Category>> GetCategoryByName(string name)
    {
        var category = await _context.Categories
            .Where(c => c.Name.ToLower() == name.ToLower())
            .SingleOrDefaultAsync();
        if (category is null) return NotFound("Category not found");
        return Ok(category);
    }

    [HttpPut]
    public async Task<ActionResult> EditCategory(Category category)
    {
        var currentCategory = await _context.Categories.FindAsync(category.Id);
        if (currentCategory is null) return NotFound("Category not found");

        currentCategory.Name = category.Name;
        var result = await _context.SaveChangesAsync() > 0;

        if (!result) return BadRequest("Can't edit category now, please try again later!");
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteCategory(Guid id)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category is null) return NotFound("Category not found");

        _context.Categories.Remove(category);
        var result = await _context.SaveChangesAsync() > 0;

        if (!result) return BadRequest("Can't delete category now, please try again later");
        return Ok();
    }

    [AllowAnonymous]
    [HttpGet("CategoryWithBlogCount")]
    public async Task<ActionResult> GetCategoryWithBlogCount()
    {
        var categoryWithCount = _context.Categories
                                    .GroupJoin(
                                        _context.Blogs, 
                                        category => category.Id, 
                                        blog => blog.Category.Id, 
                                        (category, blogs) => new { Category = category, Blogs = blogs }
                                    )
                                    .Select(group => new
                                    {
                                        Id = group.Category.Id,
                                        Name = group.Category.Name,
                                        BlogCount = group.Blogs.Count()
                                    });

        return Ok(categoryWithCount);
    }
}
