using MongoDB.Driver;

namespace DataLayer;

public static class DbConnection
{
    public static IMongoDatabase GetDatabase
    {
        get
        {
            var connectionString = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json").Build().GetSection("ConnectionStrings")["MongoDB"];
            var client = new MongoClient(connectionString);
            return client.GetDatabase("nbp");
        }
    }
}