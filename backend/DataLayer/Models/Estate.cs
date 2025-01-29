namespace DataLayer.Models;

public class Estate
{
    [BsonId]
    [BsonElement("_id")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    public required string Title { get; set; }
    public required string Location { get; set; }
    // ovo mozda treba da se napravi na longitude i latitude
    public required double Price { get; set; }
    public required string Description { get; set; }

    // VEZE

    [BsonRepresentation(BsonType.ObjectId)]
    public required string UserId { get; set; } // ID usera koji je postavio nekretninu

    [BsonRepresentation(BsonType.ObjectId)]
    public List<string> PostIds { get; set; } = new(); // Lista ID-ova postova o nekretnini
}
