using API.Data;
using API.DTO;
using API.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;
[ApiController]
[Route("api/customer")]
public class CustomerController : ControllerBase
{
    private readonly AcademyDbContext _context;
    private readonly IMapper _mapper;

    public CustomerController(AcademyDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [AllowAnonymous]
    [HttpPost]
    public async Task<IActionResult> CreateCustomer(CustomerDto customerDto)
    {
        var customer = new Customer();
        _mapper.Map(customerDto, customer);

        var course = await _context.Courses.FindAsync(customerDto.CourseId);
        customer.Course = course;

        _context.Customers.Add(customer);
        var result = await _context.SaveChangesAsync() > 0;

        if (!result) return BadRequest("Something wrong! Please try again later.");

        return Ok();
    }

    [HttpPut]
    public async Task<ActionResult<CustomerDto>> EditCustomer(CustomerDto customerDto)
    {
        var customer = await _context.Customers.FindAsync(customerDto.Id);
        var course = await _context.Courses.FindAsync(customerDto.CourseId);
        if (customer is null) return NoContent();

        _mapper.Map(customerDto, customer);
        customer.Course = course;
        
        var result = await _context.SaveChangesAsync() > 0;

        if (!result) return BadRequest("Can't edit customer, please try again later!");
        return Ok(_mapper.Map(customer, new CustomerDto()));
    }

    [HttpGet]
    public async Task<ActionResult<List<Customer>>> GetAllCustomers()
    {
        var customers = await _context.Customers
            .OrderByDescending(c => c.RegDate)
            .Include(c => c.Course).ToListAsync();

        return Ok(_mapper.Map<List<Customer>, List<CustomerDto>>(customers));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteCustomer(Guid id)
    {
        var customer = await _context.Customers.SingleOrDefaultAsync(c => c.Id.Equals(id));

        _context.Customers.Remove(customer);
        var result = await _context.SaveChangesAsync() > 0;

        if (!result) return BadRequest("Can't delete customer, please try again later!");
        return Ok();
    }
}
