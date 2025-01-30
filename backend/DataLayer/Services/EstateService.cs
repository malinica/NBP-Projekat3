namespace DataLayer.Services
{
    public class EstateService
    {

        private const string ConnectionString = "mongodb://localhost:27017";
        private const string DatabaseName = "estateDatabase";

        public EstateService()
{
    var mongoClient = new MongoClient(ConnectionString);
    var mongoDatabase = mongoClient.GetDatabase(DatabaseName);
}

private IMongoCollection<Estate> GetCollection(string collectionName)
{
    var mongoClient = new MongoClient(ConnectionString);
    var mongoDatabase = mongoClient.GetDatabase(DatabaseName);
    return mongoDatabase.GetCollection<Estate>(collectionName);
}


        public async Task<(bool isError, List<Estate>? result, ErrorMessage? error)> GetAllEstatesFromCollection(string collectionName)
        {
            try
            {
                var collection = GetCollection(collectionName);
                var estates = await collection.Find(_ => true).ToListAsync();
                return (false, estates, null);
            }
            catch (Exception ex)
            {
                return (true, null, new ErrorMessage(ex.Message, 500));
            }
        }

        public async Task<(bool isError, Estate? result, ErrorMessage? error)> GetEstate(string collectionName, string id)
        {
            try
            {
                var collection = GetCollection(collectionName);
                var estate = await collection.Find(x => x.Id == id).FirstOrDefaultAsync();
                if (estate == null)
                {
                    return (true, null, new ErrorMessage("Estate not found", 404));
                }
                return (false, estate, null);
            }
            catch (Exception ex)
            {
                return (true, null, new ErrorMessage(ex.Message, 500));
            }
        }

        public async Task<(bool isError, Estate? result, ErrorMessage? error)> CreateEstate(string collectionName, EstateCreateDTO newEstateDTO)
        {
            try
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
            UserId = newEstateDTO.UserId.ToString()
        };

                var collection = GetCollection(collectionName);
                await collection.InsertOneAsync(estate);
                return (false, estate, null);
            }
            catch (Exception ex)
            {
                return (true, null, new ErrorMessage(ex.Message, 500));
            }
        }

        public async Task<(bool isError, Estate? result, ErrorMessage? error)> UpdateEstate(string collectionName, string id, Estate updatedEstate)
        {
            try
            {
                var collection = GetCollection(collectionName);
                var existingEstate = await collection.Find(x => x.Id == id).FirstOrDefaultAsync();
                if (existingEstate == null)
                {
                    return (true, null, new ErrorMessage("Estate not found", 404));
                }
                await collection.ReplaceOneAsync(x => x.Id == id, updatedEstate);
                return (false, updatedEstate, null);
            }
            catch (Exception ex)
            {
                return (true, null, new ErrorMessage(ex.Message, 500));
            }
        }

        public async Task<(bool isError, string? result, ErrorMessage? error)> RemoveEstate(string collectionName, string id)
        {
            try
            {
                var collection = GetCollection(collectionName);
                var existingEstate = await collection.Find(x => x.Id == id).FirstOrDefaultAsync();
                if (existingEstate == null)
                {
                    return (true, null, new ErrorMessage("Estate not found", 404));
                }
                await collection.DeleteOneAsync(x => x.Id == id);
                return (false, id, null);
            }
            catch (Exception ex)
            {
                return (true, null, new ErrorMessage(ex.Message, 500));
            }
        }
    }
}
