namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommentController : ControllerBase
{
    private readonly CommentService _commentService;
    private readonly UserService _userService;

    public CommentController(CommentService commentService, UserService userService)
    {
        _commentService = commentService;
        _userService = userService;
    }
    
    [HttpPost("Create")]
    [Authorize]
    public async Task<IActionResult> CreateComment([FromBody] CreateCommentDTO commentDto)
    {
        var userResult = _userService.GetCurrentUserId(User);
        
        if (userResult.IsError)
        {
            return StatusCode(userResult.Error?.StatusCode ?? 400, userResult.Error?.Message);
        }
        
        (bool isError, var response, ErrorMessage? error) = await _commentService.CreateComment(commentDto, userResult.Data);

        if (isError)
        {
            return StatusCode(error?.StatusCode ?? 400, error?.Message);
        }

        return Ok(response);
    }
}