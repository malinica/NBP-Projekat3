using DataLayer.DTOs.Post;

namespace DataLayer.Services;

public class PostService
{
    private readonly IMongoCollection<Post> _postsCollection =
        DbConnection.GetDatabase().GetCollection<Post>("posts_collection");
    
    private readonly UserService _userService;

    public PostService(UserService userService)
    {
        _userService = userService;
    }

    public async Task<Result<PostResultDTO, ErrorMessage>> CreatePost(CreatePostDTO postDto, string userId)
    {
        try
        {
            var newPost = new Post
            {
                Title = postDto.Title,
                Content = postDto.Content,
                CreatedAt = DateTime.UtcNow,
                AuthorId = userId,
                CommentIds = [],
                EstateId = postDto.EstateId
            };

            await _postsCollection.InsertOneAsync(newPost);

            var userResult = await _userService.GetById(userId);
            
            if (userResult.IsError)
                return userResult.Error;
            
            //treba da se doda ucitavanje Estate-a kao User-a i da se i on vrati ako postoji
            
            var resultDto = new PostResultDTO
            {
                Id = newPost.Id!,
                Title = newPost.Title,
                Content = newPost.Content,
                CreatedAt = newPost.CreatedAt,
                Author = userResult.Data,
                //Estate = estateResult.Data
            };

            return resultDto;
        }
        catch (Exception)
        {
            return "Došlo je do greške prilikom kreiranja objave.".ToError();
        }
    }
}