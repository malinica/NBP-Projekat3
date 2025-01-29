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

    // VEZE

    [BsonRepresentation(BsonType.ObjectId)]
    public List<string> EstateIds { get; set; } = new(); // Lista nekretnina koje je korisnik objavio

    [BsonRepresentation(BsonType.ObjectId)]
    public List<string> PostIds { get; set; } = new(); // Lista objava korisnika na forumu

    [BsonRepresentation(BsonType.ObjectId)]
    public List<string> CommentIds { get; set; } = new(); // Lista komentara koje je korisnik napisao
}