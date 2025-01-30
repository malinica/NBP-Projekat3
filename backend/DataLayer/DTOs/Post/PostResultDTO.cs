using DataLayer.DTOs.Estate;

namespace DataLayer.DTOs.Post;

public class PostResultDTO
{
    public required string Id { get; set; }
    public required string Title { get; set; }
    public required string Content { get; set; }
    public DateTime CreatedAt { get; set; }
    public required UserResultDTO Author { get; set; }
    public EstateResultDTO? Estate { get; set; }
}