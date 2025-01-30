namespace DataLayer.Services;

public class CommentService
{
    private readonly IMongoCollection<Comment> _commentsCollection =
        DbConnection.GetDatabase().GetCollection<Comment>("comments_collection");
    
}