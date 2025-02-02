namespace DataLayer.DTOs.Comment;

public class CommentResultDTO
{
    public required string Id { get; set; }
    public required string Content { get; set; }
    public DateTime CreatedAt { get; set; }
    public required UserResultDTO Author { get; set; }
}