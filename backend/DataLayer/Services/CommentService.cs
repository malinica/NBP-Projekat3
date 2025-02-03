
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
    
     public async Task<Result<PaginatedResponseDTO<CommentResultDTO>, ErrorMessage>> GetCommentsForPost(string postId, int page = 1, int pageSize = 10)
    {
        try
        {
            var comments = await _commentsCollection.Aggregate()
                .Match(comment => comment.PostId == postId)
                .Sort(Builders<Comment>.Sort.Descending(p => p.CreatedAt))
                .Skip((page - 1) * pageSize)
                .Limit(pageSize)
                .Lookup("users_collection", "AuthorId", "_id", "AuthorData") 
                .As<BsonDocument>()
                .ToListAsync();
            
            var commentsDtos = comments.Select(comment =>
            {
                var authorDoc = comment["AuthorData"].AsBsonArray.FirstOrDefault();

                return new CommentResultDTO
                {
                    Id = comment["_id"].AsObjectId.ToString(),
                    Content = comment["Content"].AsString,
                    CreatedAt = comment["CreatedAt"].ToUniversalTime(),
                    Author = authorDoc != null ? new UserResultDTO
                    {
                        Id = authorDoc["_id"].AsObjectId.ToString(),
                        Username = authorDoc["Username"].AsString,
                        Email = authorDoc["Email"].AsString,
                        Role = (UserRole) authorDoc["Role"].AsInt32
                    } : null!
                };
            }).ToList();
            
            var totalCount = await _commentsCollection.CountDocumentsAsync(comment => comment.PostId == postId);

            return new PaginatedResponseDTO<CommentResultDTO>()
            {
                Data = commentsDtos,
                TotalLength = totalCount
            };
        }
        catch (Exception)
        {
            return "Došlo je do greške prilikom preuzimanja komentara.".ToError();
        }
    }
     
    public async Task<Result<bool, ErrorMessage>> DeleteManyAsync(List<string> commentIds)
    {
        try
        {
            var filter = Builders<Comment>.Filter.In(c => c.Id, commentIds);
            var deleteResult = await _commentsCollection.DeleteManyAsync(filter);

            return deleteResult.DeletedCount > 0;
        }
        catch (Exception)
        {
            return "Došlo je do greške prilikom brisanja komentara objave.".ToError();
        }
    }

}