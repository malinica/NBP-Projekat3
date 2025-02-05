namespace DataLayer.Services
{
    public class EstateService
    {

        private readonly IMongoCollection<Estate> _estatesCollection =
            DbConnection.GetDatabase().GetCollection<Estate>("estates_collection");
        private readonly UserService userService;
        private readonly IMongoCollection<User> _usersCollection =
            DbConnection.GetDatabase().GetCollection<User>("users_collection");

        public EstateService(UserService userS)
        {
            this.userService = userS;
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

        public async Task<Result<Estate, ErrorMessage>> GetEstate(string id)
        {
            try
            {
                var estate = await _estatesCollection.Find(x => x.Id == id).FirstOrDefaultAsync();
                if (estate != null)
                {
                    return estate;
                }
                return "Nije pronadjena nekretnina.".ToError();
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


        public async Task<Result<Estate, ErrorMessage>> UpdateEstate(string collectionName, string id, EstateUpdateDTO updatedEstate)
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

        public async Task<Result<bool, ErrorMessage>> RemoveEstate( string id)
        {
            try
            {
                var existingEstate = await _estatesCollection.Find(x => x.Id == id).FirstOrDefaultAsync();
                if (existingEstate == null)
                {
                    return "Nije pronadjena nekretnina.".ToError();
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
                if (estates.Any())
                {
                    return estates;
                }
                return "Korisnik trenutno nema nekretnina.".ToError();
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

    }
}
