namespace DataLayer.DTOs.User;

public class UserResultDTO
{
    public required string Id { get; set; }
    public required string Username { get; set; }
    public required string Email { get; set; }
    public UserRole Role { get; set; }

    [SetsRequiredMembers]
    public UserResultDTO(Models.User user)
    {
        this.Id = user.Id!;
        this.Username = user.Username;
        this.Email = user.Email;
        this.Role = user.Role;
    }
}