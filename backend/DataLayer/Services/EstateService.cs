namespace DataLayer.Services
{
    public class EstateService
    {

        private readonly IMongoCollection<Estate> _estatesCollection =
            DbConnection.GetDatabase().GetCollection<Estate>("estates_collection");
        private readonly UserService _userService;
        private readonly IMongoCollection<User> _usersCollection =
            DbConnection.GetDatabase().GetCollection<User>("users_collection");
        
        private readonly PostService _postService;

        public EstateService(UserService userService, PostService postService)
        {
            _userService = userService;
            _postService = postService;
        }

        public async Task<Result<List<Estate>, ErrorMessage>> GetAllEstatesFromCollection()
        {
            try
            {
                var estates = await _estatesCollection.Find(_ => true).ToListAsync();
                return estates;
            }
            catch (Exception)
            {
                return "Došlo je do greške prilikom preuzimanja nekretnina.".ToError();
            }
        }

        public async Task<Result<EstateResultDTO, ErrorMessage>> GetEstate(string id)
        {
            try
            {
                var estate = await _estatesCollection.Find(x => x.Id == id).FirstOrDefaultAsync();
                if(estate == null)
                    return "Nije pronađena nekretnina.".ToError();

                var userResult = await _userService.GetById(estate.UserId);
                if (userResult.IsError)
                    return userResult.Error;
                
                var estateDto = new EstateResultDTO(estate)
                {
                    User = userResult.Data
                };

                return estateDto;
            }
            catch (Exception)
            {
                return "Došlo je do greške prilikom preuzimanja nekretnine.".ToError();
            }
        }

        public async Task<Result<Estate, ErrorMessage>> CreateEstate(EstateCreateDTO newEstateDTO, string? userID)
        {
            try
            {
                if (userID != null)
                {
                    var imagePaths = new List<string>();

                    foreach (var file in newEstateDTO.Images)
                    {
                        var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                        var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "EstateImages");
                        /* 
                        Vec dodato u program.cs
                        if (!Directory.Exists(path))
                        {
                            Directory.CreateDirectory(path);
                        }

                        */

                        var filePath = Path.Combine(path, fileName);

                        await using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                        }

                        imagePaths.Add("/EstateImages/" + fileName);
                    }

                    var estate = new Estate
                    {
                        Title = newEstateDTO.Title,
                        Description = newEstateDTO.Description,
                        Price = newEstateDTO.Price,
                        SquareMeters = newEstateDTO.SquareMeters,
                        TotalRooms = newEstateDTO.TotalRooms,
                        Category = newEstateDTO.Category,
                        FloorNumber = newEstateDTO.FloorNumber,
                        Images = imagePaths,
                        Longitude = newEstateDTO.Longitude,
                        Latitude = newEstateDTO.Latitude,
                        UserId = userID
                    };

                    await _estatesCollection.InsertOneAsync(estate);

                    return estate;
                }
                else
                {
                    return "Došlo je do greške prilikom traženja korisnika.".ToError();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return "Došlo je do greške prilikom kreiranja nekretnine.".ToError();
            }
        }


        public async Task<Result<Estate, ErrorMessage>> UpdateEstate(string id, EstateUpdateDTO updatedEstate)
        {
            try
            {

                var existingEstate = await _estatesCollection.Find(x => x.Id == id).FirstOrDefaultAsync();
                if (existingEstate == null)
                {
                    return "Nije pronadjena nekretnina.".ToError();
                }

                existingEstate.Title = updatedEstate.Title;
                existingEstate.Description = updatedEstate.Description;
                existingEstate.Price = updatedEstate.Price;
                existingEstate.SquareMeters = updatedEstate.SquareMeters;
                existingEstate.TotalRooms = updatedEstate.TotalRooms;
                existingEstate.Category = updatedEstate.Category;
                existingEstate.FloorNumber = updatedEstate.FloorNumber;
                existingEstate.Images = updatedEstate.Images;
                existingEstate.Longitude = updatedEstate.Longitude;
                existingEstate.Latitude = updatedEstate.Latitude;
                existingEstate.UserId = updatedEstate.UserId;

                await _estatesCollection.ReplaceOneAsync(x => x.Id == id, existingEstate);

                return existingEstate;
            }
            catch (Exception)
            {
                return "Došlo je do greške prilikom ažuriranja nekretnine.".ToError();
            }
        }

        public async Task<Result<bool, ErrorMessage>> RemoveEstate(string id)
        {
            try
            {
                var existingEstate = await _estatesCollection.Find(x => x.Id == id).FirstOrDefaultAsync();
                if (existingEstate == null)
                {
                    return "Nije pronadjena nekretnina.".ToError();
                }

                foreach (var postId in existingEstate.PostIds)
                {
                    await _postService.DeletePost(postId);
                }

                var result = await _estatesCollection.DeleteOneAsync(x => x.Id == id);
                if (result.DeletedCount > 0)
                {
                    return true;
                }
                return false;
            }
            catch (Exception)
            {
                return "Došlo je do greške prilikom brisanja nekretnine.".ToError();
            }
        }

        public async Task<Result<List<Estate>, ErrorMessage>> GetEstatesCreatedByUser(string userId)
        {
            try
            {
                var estates = await _estatesCollection.Find(x => x.UserId == userId).ToListAsync();
                return estates;
            }
            catch (Exception)
            {
                return "Došlo je do greške prilikom preuzimanja nekretnina.".ToError();
            }
        }

        public async Task<Result<bool, ErrorMessage>> AddPostToEstate(string estateId, string postId)
        {
            try
            {
                var updateResult = await _estatesCollection.UpdateOneAsync(
                    e => e.Id == estateId,
                    Builders<Estate>.Update.Push(e => e.PostIds, postId)
                );

                if (updateResult.ModifiedCount == 0)
                {
                    return "Nekretnina nije pronađena ili nije ažurirana.".ToError();
                }

                return true;
            }
            catch (Exception)
            {
                return "Došlo je do greške prilikom dodavanja objave kod nekretnine.".ToError();
            }
        }

        public async Task<Result<bool, ErrorMessage>> RemovePostFromEstate(string estateId, string postId)
        {
            try
            {
                var filter = Builders<Estate>.Filter.Eq(e => e.Id, estateId);
                var update = Builders<Estate>.Update.Pull(e => e.PostIds, postId);

                var updateResult = await _estatesCollection.UpdateOneAsync(filter, update);

                if (updateResult.ModifiedCount == 0)
                    return "Objava nije pronađena kod nekretnine.".ToError();

                return true;
            }
            catch (Exception)
            {
                return "Došlo je do greške prilikom uklanjanja objave sa nekretnine.".ToError();
            }
        }

        public async Task<Result<bool, ErrorMessage>> AddFavoriteEstate(string userId, string estateId)
        {
            try
            {
                var user = await _usersCollection.Find(x => x.Id == userId).FirstOrDefaultAsync();
                var estate = await _estatesCollection.Find(x => x.Id == estateId).FirstOrDefaultAsync();

                if (user.FavoriteEstateIds.Contains(estateId))
                {
                    return "Nekretnina je već u omiljenim.".ToError();
                }

                user.FavoriteEstateIds.Add(estateId);

                var updateResult = await _usersCollection.ReplaceOneAsync(
                    x => x.Id == userId,
                    user
                );

                if (updateResult.ModifiedCount > 0)
                {
                    return true;
                }
                return "Došlo je do greške prilikom ažuriranja omiljenih nekretnina.".ToError();
            }
            catch (Exception)
            {
                return "Došlo je do greške prilikom dodavanja nekretnine u omiljene.".ToError();
            }
        }

        public async Task<Result<PaginatedResponseDTO<Estate>, ErrorMessage>> SearchEstatesFilter(
            string? title = null,
            int? priceMin = null,
            int? priceMax = null,
            List<string>? categories = null,
            int skip = 0,
            int limit = 10)
        {
            try
            {
                var filter = Builders<Estate>.Filter.Empty;

                if (!string.IsNullOrWhiteSpace(title))
                    filter &= Builders<Estate>.Filter.Regex(x => x.Title, new BsonRegularExpression(title, "i"));

                if (priceMin.HasValue)
                    filter &= Builders<Estate>.Filter.Gte(x => x.Price, priceMin.Value);

                if (priceMax.HasValue)
                    filter &= Builders<Estate>.Filter.Lte(x => x.Price, priceMax.Value);
                
                if (categories != null && categories.Any())
                {
                    var categoryEnums = categories
                        .Select(category =>
                            Enum.TryParse<EstateCategory>(category, true, out var parsedCategory)
                                ? parsedCategory
                                : (EstateCategory?)null)
                        .Where(c => c.HasValue)
                        .Select(c => c.Value)
                        .ToList();

                    filter &= Builders<Estate>.Filter.In(x => x.Category, categoryEnums);
                }

                var estates = await _estatesCollection
                    .Find(filter)
                    .Skip(skip)
                    .Limit(limit)
                    .ToListAsync();

                var totalCount = await _estatesCollection.CountDocumentsAsync(_ => true);

                return new PaginatedResponseDTO<Estate>
                {
                    Data = estates,
                    TotalLength = totalCount
                };
            }
            catch (Exception)
            {
                return "Došlo je do greške prilikom pretrage nekretnina.".ToError();
            }
        }

        public async Task<Result<List<Estate>, ErrorMessage>> GetUserFavoriteEstates(string userId)
        {
            try
            {
                var user = await _usersCollection.Find(x => x.Id == userId).FirstOrDefaultAsync();

                if (!user.FavoriteEstateIds.Any())
                {
                    return "Korisnik nema omiljenih nekretnina.".ToError();
                }

                var favoriteEstates = await _estatesCollection
                                    .Find(x => user.FavoriteEstateIds.Contains(x.Id!))
                                    .ToListAsync();

                return favoriteEstates;
            }
            catch (Exception)
            {
                return "Došlo je do greške prilikom preuzimanja omiljenih nekretnina.".ToError();
            }
        }
    }
}
