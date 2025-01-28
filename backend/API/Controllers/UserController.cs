namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly UserService userService;

    public UserController(UserService userService)
    {
        this.userService = userService;
    }
    
    [HttpPost("Register")]
    public async Task<IActionResult> Register([FromBody] CreateUserDTO userDto)
    {
        (bool isError, var response, ErrorMessage? error) = await userService.Register(userDto);

        if (isError)
        {
            return StatusCode(error?.StatusCode ?? 400, error?.Message);
        }

        return Ok(response);
    }
    
    [HttpPost("Login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDTO request)
    {
        (bool isError, var response, ErrorMessage? error) = await userService.Login(request);

        if (isError)
        {
            return StatusCode(error?.StatusCode ?? 400, error?.Message);
        }

        return Ok(response);
    }
}