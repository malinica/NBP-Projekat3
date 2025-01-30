using DataLayer.DTOs.Estate;
using DataLayer.Models;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EstateController : ControllerBase
{
    private readonly EstateService estateService;
    private readonly UserService userService;

    public EstateController(EstateService estate, UserService userService)
    {
        this.estateService = estate;
        this.userService = userService;
    }

    [HttpPost("CreateEstate/{collectionName}")]
public async Task<IActionResult> CreateEstate(string collectionName, [FromBody] EstateCreateDTO newEstate)
{
    var (isError, result, error) = await estateService.CreateEstate(collectionName, newEstate);

    if (isError)
    {
        return StatusCode(error?.StatusCode ?? 400, error?.Message);
    }

           return Ok("Estate created");

}

}