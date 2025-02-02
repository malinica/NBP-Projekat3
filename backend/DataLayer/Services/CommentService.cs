
namespace DataLayer.Services;

public class CommentService
{
    private readonly IMongoCollection<Comment> _commentsCollection =
        DbConnection.GetDatabase().GetCollection<Comment>("comments_collection");
    
    private readonly UserService _userService;
    private readonly PostService _postService;

    public CommentService(UserService userService, PostService postService)
    {
        _userService = userService;
        _postService = postService;
    }
    
    public async Task<Result<CommentResultDTO, ErrorMessage>> CreateComment(CreateCommentDTO commentDto, string userId)
    {
        try
        {
            var newComment = new Comment
            {
                Content = commentDto.Content,
                CreatedAt = DateTime.UtcNow,
                AuthorId = userId,
                PostId = commentDto.PostId
            };

            await _commentsCollection.InsertOneAsync(newComment);

            var postUpdateResult = await _postService.AddCommentToPost(commentDto.PostId, newComment.Id!);

            if (postUpdateResult.IsError)
                return postUpdateResult.Error;
            
            var userResult = await _userService.GetById(userId);
            
            if (userResult.IsError)
                return userResult.Error;
            
            var resultDto = new CommentResultDTO
            {
                Id = newComment.Id!,
                Content = newComment.Content,
                CreatedAt = newComment.CreatedAt,
                Author = userResult.Data
            };

            return resultDto;
        }
        catch (Exception)
        {
            return "Došlo je do greške prilikom kreiranja komentara.".ToError();
        }
    }
}