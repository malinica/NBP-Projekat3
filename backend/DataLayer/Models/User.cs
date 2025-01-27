namespace DataLayer.Models;

public class User
{
    [BsonId]
    [BsonElement("_id")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    public required string Username { get; init; }
    public string? Email { get; init; }
    public string? PasswordHash { get; set; }
    public UserRole Role { get; init; }
}