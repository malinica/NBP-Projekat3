
namespace DataLayer.Services;

public class UserService
{
    private IMongoCollection<User> _usersCollection = DbConnection.GetDatabase.GetCollection<User>("users_collection");
    private readonly PasswordHasher<User> passwordHasher = new PasswordHasher<User>();
    private readonly TokenService tokenService;

    public UserService(TokenService tokenService)
    {
        this.tokenService = tokenService;
    }
    
    public async Task<Result<AuthResponseDTO, ErrorMessage>> Register(CreateUserDTO userDto)
    {
        try
        {
            var existingUserByUsername = await _usersCollection
                .Find(u => u.Username == userDto.Username)
                .FirstOrDefaultAsync();

            if (existingUserByUsername != null)
                return "Već postoji korisnik sa unetim korisničkim imenom.".ToError();
            
            var existingUserByEmail = await _usersCollection
                .Find(u => u.Email == userDto.Email)
                .FirstOrDefaultAsync();

            if (existingUserByEmail != null)
                return "Već postoji korisnik sa unetim e-mail-om.".ToError();
            
            var newUser = new User
            {
                Username = userDto.Username,
                Email = userDto.Email,
                PasswordHash = passwordHasher.HashPassword(null!, userDto.Password),
                Role = UserRole.User
            };

            await _usersCollection.InsertOneAsync(newUser);

            return new AuthResponseDTO
            {
                Id = newUser.Id!,
                Username = newUser.Username,
                Email = newUser.Email,
                Role = UserRole.User,
                Token = tokenService.CreateToken(newUser)
            };
        }
        catch (Exception)
        {
            return "Došlo je do greške prilikom kreiranja korisnika.".ToError();
        }
    }

}