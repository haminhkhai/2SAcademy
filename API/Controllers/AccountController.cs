using System.Security.Claims;
using API.Data;
using API.DTO;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/account")]
public class AccountController : ControllerBase
{
    private readonly AcademyDbContext _context;
    private readonly TokenService _tokenService;

    public AccountController(AcademyDbContext context, TokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        //User.FindFirstValue(ClaimTypes.Name) this will get value from 
        //request header (jwt authorization header)
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == User.FindFirstValue(ClaimTypes.Name));

        if (user is null) return null;

        var userDto = new UserDto
        {
            Username = user.Username,
            Token = _tokenService.CreateToken(user)
        };
        return userDto;
    }

    [HttpPost("login")]
     [AllowAnonymous]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await _context.Users
            .Where(u => u.Username == loginDto.Uname)
            .Where(u => u.Password == loginDto.Secret)
            .SingleOrDefaultAsync();

        if (user is null) return Unauthorized("Invalid username or password");

        var userDto = new UserDto
        {
            Username = user.Username,
            DisplayName = user.DisplayName,
            Token = _tokenService.CreateToken(user)
        };

        return Ok(userDto);
    }
}
