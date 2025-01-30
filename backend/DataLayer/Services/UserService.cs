namespace DataLayer.Services;

public class UserService
{
    private readonly IMongoCollection<User> _usersCollection =
        DbConnection.GetDatabase().GetCollection<User>("users_collection");
    private readonly PasswordHasher<User> _passwordHasher = new PasswordHasher<User>();
    private readonly TokenService _tokenService;

    public UserService(TokenService tokenService)
    {
        this._tokenService = tokenService;
    }
    
    public async Task<Result<AuthResponseDTO, ErrorMessage>> Register(CreateUserDTO userDto)
    {
        try
        {
            string usernamePattern = @"^[a-zA-Z0-9._]+$";
            Regex usernameRegex = new Regex(usernamePattern);
            
            if (!usernameRegex.IsMatch(userDto.Username))
                return "Korisničko ime nije u validnom formatu. Dozvoljena su mala i velika slova abecede, brojevi, _ i .".ToError();
            
            string emailPattern = @"^[^\s@]+@[^\s@]+\.[^\s@]+$";
            Regex emailRegex = new Regex(emailPattern);
            
            if (!emailRegex.IsMatch(userDto.Email))
                return "E-mail nije u ispravnom formatu.".ToError();
            
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
                PasswordHash = _passwordHasher.HashPassword(null!, userDto.Password),
                Role = UserRole.User
            };

            await _usersCollection.InsertOneAsync(newUser);

            return new AuthResponseDTO
            {
                Id = newUser.Id!,
                Username = newUser.Username,
                Email = newUser.Email,
                Role = UserRole.User,
                Token = _tokenService.CreateToken(newUser)
            };
        }
        catch (Exception)
        {
            return "Došlo je do greške prilikom registracije korisnika.".ToError();
        }
    }
    
    public async Task<Result<AuthResponseDTO, ErrorMessage>> Login(LoginRequestDTO request)
    {
        try
        {
            var user = await _usersCollection
                .Find(u => u.Email == request.Email)
                .FirstOrDefaultAsync();
            
            if (user == null)
                return "Neispravan email ili lozinka.".ToError(403);
            
            var verificationResult = _passwordHasher.VerifyHashedPassword(null!, user.PasswordHash!, request.Password);
            if (verificationResult == PasswordVerificationResult.Failed)
                return "Neispravan email ili lozinka.".ToError(403);
            
            var accessToken = _tokenService.CreateToken(user);
            
            return new AuthResponseDTO
            {
                Id = user.Id!,
                Username = user.Username,
                Email = user.Email,
                Token = accessToken,
                Role = user.Role
            };
        }
        catch (Exception)
        {
            return "Došlo je do greške prilikom prijavljivanja.".ToError();
        }
    }

    public Result<string, ErrorMessage> GetCurrentUserId(ClaimsPrincipal user) {
        try
        {
            var userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId != null)
                return userId;

            return "Došlo je do greške prilikom učitavanja korisnika.".ToError();
        }
        catch (Exception)
        {
            return "Došlo je do greške prilikom učitavanja korisnika.".ToError();
        }
    }
    
    public async Task<Result<UserResultDTO, ErrorMessage>> GetCurrentUser(ClaimsPrincipal user) {
        try
        {
            var userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if(userId != null)
                return await GetById(userId);

            return "Došlo je do greške prilikom učitavanja korisnika.".ToError();
        }
        catch (Exception)
        {
            return "Došlo je do greške prilikom učitavanja korisnika.".ToError();
        }
    }
    
    public async Task<Result<UserResultDTO, ErrorMessage>> GetById(string id)
    {
        try
        {
            var user = await _usersCollection
                            .Find(u => u.Id == id)
                            .FirstOrDefaultAsync();
            
            if(user == null)
                return "Korisnik nije pronađen.".ToError(404);

            return new UserResultDTO(user);
        }
        catch (Exception)
        {
            return "Došlo je do greške prilikom preuzimanja podataka o korisniku.".ToError();
        }
    }
}