using API.Data;
using API.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/gallery")]
public class GalleryController : ControllerBase
{
    private readonly AcademyDbContext _context;
    private readonly IMapper _mapper;

    public GalleryController(AcademyDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<List<Gallery>>> GetAllGallery()
    {
        var galleries = await _context.Galleries.ToListAsync();
        return Ok(galleries);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Gallery>> GetGallery(Guid id)
    {
        var gallery = await _context.Galleries.FindAsync(id);
        if (gallery is null) return NotFound("Photo not found");
        return Ok(gallery);
    }

    [HttpPut]
    public async Task<ActionResult> EditGallery(Gallery gallery)
    {
        var currentGallery = await _context.Galleries.FindAsync(gallery.Id);
        if (currentGallery is null) return NotFound("Photo not found");

        _mapper.Map(gallery, currentGallery);
        var result = await _context.SaveChangesAsync() > 0;

        if (!result) return BadRequest("Can't edit gallery rightnow, please try again later!");
        return Ok();

    }

    [HttpPost]
    public async Task<ActionResult> CreateGallery(Gallery gallery)
    {
        _context.Galleries.Add(gallery);
        var result = await _context.SaveChangesAsync() > 0;

        if (!result) return BadRequest("Can't add gallery now, please try again later!");
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteGallery(Guid id)
    {
        var gallery = await _context.Galleries.FindAsync(id);
        if (gallery is null) return NotFound("Photo not found");

        _context.Galleries.Remove(gallery);
        var result = await _context.SaveChangesAsync() > 0;
        if (!result) return BadRequest("Can't delete photo right now, please try again later!");
        return Ok();
    }
}
