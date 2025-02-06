namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly UserService _userService;

    public UserController(UserService userService)
    {
        _userService = userService;
    }
    
    [HttpPost("Register")]
    public async Task<IActionResult> Register([FromBody] CreateUserDTO userDto)
    {
        (bool isError, var response, ErrorMessage? error) = await _userService.Register(userDto);

        if (isError)
        {
            return StatusCode(error?.StatusCode ?? 400, error?.Message);
        }

        return Ok(response);
    }
    
    [HttpPost("Login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDTO request)
    {
        (bool isError, var response, ErrorMessage? error) = await _userService.Login(request);

        if (isError)
        {
            return StatusCode(error?.StatusCode ?? 400, error?.Message);
        }

        return Ok(response);
    }
    
    [HttpGet("GetUserById/{id}")]
    public async Task<IActionResult> GetUserById([FromRoute] string id)
    {
        (bool isError, var response, ErrorMessage? error) = await _userService.GetById(id);

        if (isError)
        {
            return StatusCode(error?.StatusCode ?? 400, error?.Message);
        }

        return Ok(response);
    }
}