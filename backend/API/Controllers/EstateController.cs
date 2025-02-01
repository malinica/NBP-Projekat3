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

    // Zakomentariso sam sve za authorize da bi mogo testiram jel radi u sweger

    [HttpPost("CreateEstate/{collectionName}")]
    [Authorize]
    public async Task<IActionResult> CreateEstate(string collectionName, [FromBody] EstateCreateDTO newEstate)
    {
        // var userResult = userService.GetCurrentUserId(User);

        // if (userResult.IsError)
        // {
        //     return StatusCode(userResult.Error?.StatusCode ?? 400, userResult.Error?.Message);
        // }
        var user=userService.GetCurrentUserId(User);
        (bool isError, var response, ErrorMessage? error) = await estateService.CreateEstate(collectionName, newEstate,user.IsError ? null : user.Data);

        if (isError)
        {
            return StatusCode(error?.StatusCode ?? 400, error?.Message);
        }

        return Ok("Estate created");
    }

    [HttpGet("GetAllEstates/{collectionName}")]
    public async Task<IActionResult> GetAllEstates(string collectionName)
    {
        (bool isError, var response, ErrorMessage? error) = await estateService.GetAllEstatesFromCollection(collectionName);
        if (isError)
        {
            return StatusCode(error?.StatusCode ?? 400, error?.Message);
        }
        return Ok(response);
    }

    [HttpGet("GetEstate/{collectionName}/{id}")]
    public async Task<IActionResult> GetEstate(string collectionName, string id)
    {
        (bool isError, var response, ErrorMessage? error) = await estateService.GetEstate(collectionName, id);
        if (isError)
        {
            return StatusCode(error?.StatusCode ?? 400, error?.Message);
        }
        return Ok(response);
    }

    [HttpPut("UpdateEstate/{collectionName}/{id}")]
    //[Authorize]
    public async Task<IActionResult> UpdateEstate(string collectionName, string id, [FromBody] EstateUpdateDTO updatedEstate)
    {
        // var userResult = userService.GetCurrentUserId(User);
        // if (userResult.IsError)
        // {
        //     return StatusCode(userResult.Error?.StatusCode ?? 400, userResult.Error?.Message);
        // }

        (bool isError, _, ErrorMessage? error) = await estateService.UpdateEstate(collectionName, id, updatedEstate);
        if (isError)
        {
            return StatusCode(error?.StatusCode ?? 400, error?.Message);
        }
        return Ok("Estate updated");
    }

    [HttpDelete("RemoveEstate/{collectionName}/{id}")]
    //[Authorize]
    public async Task<IActionResult> RemoveEstate(string collectionName, string id)
    {
        // var userResult = userService.GetCurrentUserId(User);
        // if (userResult.IsError)
        // {
        //     return StatusCode(userResult.Error?.StatusCode ?? 400, userResult.Error?.Message);
        // }

        (bool isError, _, ErrorMessage? error) = await estateService.RemoveEstate(collectionName, id);
        if (isError)
        {
            return StatusCode(error?.StatusCode ?? 400, error?.Message);
        }
        return Ok("Estate removed");
    }

}