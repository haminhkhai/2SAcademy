using API.Data;
using API.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/artist")]
public class ArtistController : ControllerBase
{
    private readonly AcademyDbContext _context;
    private readonly IMapper _mapper;

    public ArtistController(AcademyDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpPost]
    public async Task<ActionResult> CreateArtist(Artist artist)
    {
        _context.Artists.Add(artist);
        var result = await _context.SaveChangesAsync() > 0;
        if (!result) return BadRequest("Can't add artist, please try again later!");

        return Ok();
    }

    [HttpPut]
    public async Task<ActionResult> EditArtist(Artist artist) {
        var currentArtist = await _context.Artists.FindAsync(artist.Id);
        if (currentArtist is null) return NotFound();

        _mapper.Map(artist, currentArtist);
        var result = await _context.SaveChangesAsync() > 0;

        if (!result) return BadRequest("Problem editting Artist");
        return Ok();
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<List<Artist>>> GetAllArtist()
    {
        var artists = await _context.Artists.ToListAsync();
        return Ok(artists);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Artist>> GetArtist(Guid id) {
        var artist = await _context.Artists.FindAsync(id);
        if (artist is null) return NoContent();
        return Ok(artist);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteArtist(Guid id) {
        var artist = await _context.Artists.FindAsync(id);
        if (artist is null) return NotFound("Can't find this artist");

        _context.Remove(artist);
        var result = await _context.SaveChangesAsync() > 0;
        if (!result) return BadRequest("Can't delete this artist, please try again later");

        return Ok();
    }
}
