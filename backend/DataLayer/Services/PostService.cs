namespace DataLayer.Services;

public class PostService
{
    private readonly IMongoCollection<Post> _postsCollection =
        DbConnection.GetDatabase().GetCollection<Post>("posts_collection");
    
    private readonly UserService _userService;

    public PostService(UserService userService)
    {
        _userService = userService;
    }

    public async Task<Result<PostResultDTO, ErrorMessage>> CreatePost(CreatePostDTO postDto, string userId)
    {
        try
        {
            var newPost = new Post
            {
                Title = postDto.Title,
                Content = postDto.Content,
                CreatedAt = DateTime.UtcNow,
                AuthorId = userId,
                CommentIds = [],
                EstateId = postDto.EstateId
            };

            await _postsCollection.InsertOneAsync(newPost);

            var userResult = await _userService.GetById(userId);
            
            if (userResult.IsError)
                return userResult.Error;
            
            //treba da se doda ucitavanje Estate-a kao User-a i da se i on vrati ako postoji
            
            var resultDto = new PostResultDTO
            {
                Id = newPost.Id!,
                Title = newPost.Title,
                Content = newPost.Content,
                CreatedAt = newPost.CreatedAt,
                Author = userResult.Data,
                //Estate = estateResult.Data
            };

            return resultDto;
        }
        catch (Exception)
        {
            return "Došlo je do greške prilikom kreiranja objave.".ToError();
        }
    }
    
    public async Task<Result<PaginatedResponseDTO<PostResultDTO>, ErrorMessage>> GetAllPosts(int page = 1, int pageSize = 10)
    {
        try
        {
            var posts = await _postsCollection.Aggregate()
                .Sort(Builders<Post>.Sort.Descending(p => p.CreatedAt))
                .Skip((page - 1) * pageSize)
                .Limit(pageSize)
                .Lookup("users_collection", "AuthorId", "_id", "AuthorData") 
                .Lookup("estates_collection", "EstateId", "_id", "EstateData")
                .As<BsonDocument>()
                .ToListAsync();

            
            var postsDtos = posts.Select(post =>
            {
                var authorDoc = post["AuthorData"].AsBsonArray.FirstOrDefault();
                var estateDoc = post["EstateData"].AsBsonArray.FirstOrDefault();

                return new PostResultDTO
                {
                    Id = post["_id"].AsObjectId.ToString(),
                    Title = post["Title"].AsString,
                    Content = post["Content"].AsString,
                    CreatedAt = post["CreatedAt"].ToUniversalTime(),

                    Author = authorDoc != null ? new UserResultDTO
                    {
                        Id = authorDoc["_id"].AsObjectId.ToString(),
                        Username = authorDoc["Username"].AsString,
                        Email = authorDoc["Email"].AsString,
                        Role = (UserRole) authorDoc["Role"].AsInt32
                    } : null!,

                    // Estate = estateDoc != null ? new EstateResultDTO
                    // {
                    //     Id = estateDoc["_id"].AsObjectId.ToString(),
                    //     Address = estateDoc["Address"].AsString,
                    //     Price = estateDoc["Price"].ToDecimal()
                    // } : null
                };
            }).ToList();
            
            var totalCount = await _postsCollection.CountDocumentsAsync(_ => true);

            return new PaginatedResponseDTO<PostResultDTO>()
            {
                Data = postsDtos,
                TotalLength = totalCount
            };
        }
        catch (Exception)
        {
            return "Došlo je do greške prilikom preuzimanja objava.".ToError();
        }
    }
    
    public async Task<Result<PostResultDTO, ErrorMessage>> GetPostById(string postId)
    {
        try
        {
            var post = await _postsCollection.Aggregate()
                .Match(Builders<Post>.Filter.Eq("_id", ObjectId.Parse(postId)))
                .Lookup("users_collection", "AuthorId", "_id", "AuthorData")
                .Lookup("estates_collection", "EstateId", "_id", "EstateData")
                .As<BsonDocument>()
                .FirstOrDefaultAsync();

            if (post == null)
                return "Post nije pronađen.".ToError(404);

            var authorDoc = post["AuthorData"].AsBsonArray.FirstOrDefault();
            var estateDoc = post["EstateData"].AsBsonArray.FirstOrDefault();

            var postDto = new PostResultDTO
            {
                Id = post["_id"].AsObjectId.ToString(),
                Title = post["Title"].AsString,
                Content = post["Content"].AsString,
                CreatedAt = post["CreatedAt"].ToUniversalTime(),

                Author = authorDoc != null ? new UserResultDTO
                {
                    Id = authorDoc["_id"].AsObjectId.ToString(),
                    Username = authorDoc["Username"].AsString,
                    Email = authorDoc["Email"].AsString,
                    Role = (UserRole)authorDoc["Role"].AsInt32
                } : null!,

                // Estate = estateDoc != null ? new EstateResultDTO
                // {
                //     Id = estateDoc["_id"].AsObjectId.ToString(),
                //     Address = estateDoc["Address"].AsString,
                //     Price = estateDoc["Price"].ToDecimal()
                // } : null
            };

            return postDto;
        }
        catch (Exception)
        {
            return "Došlo je do greške prilikom preuzimanja objave.".ToError();
        }
    }
    
    //metoda za pribavljanje objava za konkretnu nekretninu, ista kao GetAll s tim sto ima i estateId
    //ne moze dok se ne napravi EstateResult
    
    public async Task<Result<bool, ErrorMessage>> UpdatePost(string postId, UpdatePostDTO postDto)
    {
        try
        {
            var existingPost = await _postsCollection
                .Find(p => p.Id == postId)
                .FirstOrDefaultAsync();

            if (existingPost == null)
            {
                return "Objava sa datim ID-jem ne postoji.".ToError(404);
            }

            existingPost.Title = postDto.Title;
            existingPost.Content = postDto.Content;
            
            var res = await _postsCollection.ReplaceOneAsync(p => p.Id == postId, existingPost);

            return true;
        }
        catch (Exception)
        {
            return "Došlo je do greške prilikom ažuriranja objave.".ToError();
        }
    }
    
    public async Task<Result<bool, ErrorMessage>> DeletePost(string postId)
    {
        try
        {
            var existingPost = await _postsCollection
                .Find(p => p.Id == postId)
                .FirstOrDefaultAsync();

            if (existingPost == null)
            {
                return "Objava sa datim ID-jem ne postoji.".ToError();
            }
            // var deleteCommentsResult = await _commentService.DeleteManyAsync(existingPost.CommentIds);
            var deleteResult = await _postsCollection.DeleteOneAsync(p => p.Id == postId);

            if (deleteResult.DeletedCount == 0)
            {
                return "Došlo je do greške prilikom brisanja objave.".ToError();
            }

            return true;
        }
        catch (Exception)
        {
            return "Došlo je do greške prilikom brisanja objave.".ToError();
        }
    }
    
    public async Task<Result<bool, ErrorMessage>> AddCommentToPost(string postId, string commentId)
    {
        try
        {
            var updateResult = await _postsCollection.UpdateOneAsync(
                p => p.Id == postId,
                Builders<Post>.Update.Push(p => p.CommentIds, commentId)
            );

            if (updateResult.ModifiedCount == 0)
            {
                return "Post nije pronađen ili nije ažuriran.".ToError();
            }

            return true;
        }
        catch (Exception)
        {
            return "Došlo je do greške prilikom dodavanja komentara objavi.".ToError();
        }
    }
}