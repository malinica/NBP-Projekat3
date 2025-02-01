namespace DataLayer.Services
{
    public class EstateService
    {

        private const string ConnectionString = "mongodb://localhost:27017";
        private const string DatabaseName = "estateDatabase";
        private readonly UserService userService;

        public EstateService(UserService userS)
        {
            this.userService=userS;
            var mongoClient = new MongoClient(ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(DatabaseName);
        }

        private IMongoCollection<Estate> GetCollection(string collectionName)
        {
            var mongoClient = new MongoClient(ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(DatabaseName);
            return mongoDatabase.GetCollection<Estate>(collectionName);
        }

        public async Task<Result<List<Estate>, ErrorMessage>> GetAllEstatesFromCollection(string collectionName)
        {
            try
            {
                var collection = GetCollection(collectionName);
                var estates = await collection.Find(_ => true).ToListAsync();
                return estates;
            }
            catch (Exception)
            {
                return "Došlo je do greške prilikom preuzimanja nekretnina.".ToError();
            }
        }

        public async Task<Result<Estate, ErrorMessage>> GetEstate(string collectionName, string id)
        {
            try
            {
                var collection = GetCollection(collectionName);
                var estate = await collection.Find(x => x.Id == id).FirstOrDefaultAsync();
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

        public async Task<Result<Estate, ErrorMessage>> CreateEstate(string collectionName, EstateCreateDTO newEstateDTO,string? userID)
        {
            try
            {
                //var userCreator=await userService.GetCurrentUser(User)//GetById(newEstateDTO.UserId);
                if(userID!=null)
                {

                var estate = new Estate
                {
                    Title = newEstateDTO.Title,
                    Description = newEstateDTO.Description,
                    Price = newEstateDTO.Price,
                    SquareMeters = newEstateDTO.SquareMeters,
                    TotalRooms = newEstateDTO.TotalRooms,
                    Category = newEstateDTO.Category,
                    FloorNumber = newEstateDTO.FloorNumber,
                    Images = newEstateDTO.Images,
                    Longitude = newEstateDTO.Longitude,
                    Latitude = newEstateDTO.Latitude,
                    UserId=userID
                };

                var collection = GetCollection(collectionName);
                await collection.InsertOneAsync(estate);
                return estate;
                }
                else
                return "Došlo je do greške prilikom trazenja korisnika".ToError();
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
                var collection = GetCollection(collectionName);
                var existingEstate = await collection.Find(x => x.Id == id).FirstOrDefaultAsync();
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

                await collection.ReplaceOneAsync(x => x.Id == id, existingEstate);

                return existingEstate;
            }
            catch (Exception)
            {
                return "Došlo je do greške prilikom ažuriranja nekretnine.".ToError();
            }
        }

        public async Task<Result<bool, ErrorMessage>> RemoveEstate(string collectionName, string id)
        {
            try
            {
                var collection = GetCollection(collectionName);
                var existingEstate = await collection.Find(x => x.Id == id).FirstOrDefaultAsync();
                if (existingEstate == null)
                {
                    return "Nije pronadjena nekretnina.".ToError();
                }
                
                var result = await collection.DeleteOneAsync(x => x.Id == id);
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
    }
}
