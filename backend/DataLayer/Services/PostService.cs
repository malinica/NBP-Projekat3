using Microsoft.Extensions.DependencyInjection;

namespace DataLayer.Services;

public class PostService
{
    private readonly IMongoCollection<Post> _postsCollection =
        DbConnection.GetDatabase().GetCollection<Post>("posts_collection");

    private readonly UserService _userService;
    private readonly EstateService _estateService;
    private readonly IServiceProvider _serviceProvider;

    public PostService(UserService userService, EstateService estateService,IServiceProvider serviceProvider)
    {
        _userService = userService;
        _serviceProvider = serviceProvider;
        _estateService = estateService;
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

            EstateResultDTO? estate = null;
            if (postDto.EstateId != null)
            {
                var estateResult = await _estateService.GetEstate(postDto.EstateId);
                
                if (estateResult.IsError)
                    return estateResult.Error;
                
                estate = new EstateResultDTO(estateResult.Data);
            }

            var resultDto = new PostResultDTO
            {
                Id = newPost.Id!,
                Title = newPost.Title,
                Content = newPost.Content,
                CreatedAt = newPost.CreatedAt,
                Author = userResult.Data,
                Estate = estate
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


            var postsDtos = posts.Select(post => new PostResultDTO(post)).ToList();

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

            var postDto = new PostResultDTO(post);

            return postDto;
        }
        catch (Exception)
        {
            return "Došlo je do greške prilikom preuzimanja objave.".ToError();
        }
    }

    public async Task<Result<PaginatedResponseDTO<PostResultDTO>, ErrorMessage>> GetAllPostsForEstate(string estateId, int page = 1, int pageSize = 10)
    {
        try
        {
            var posts = await _postsCollection.Aggregate()
                .Match(post => post.EstateId == estateId)
                .Sort(Builders<Post>.Sort.Descending(p => p.CreatedAt))
                .Skip((page - 1) * pageSize)
                .Limit(pageSize)
                .Lookup("users_collection", "AuthorId", "_id", "AuthorData")
                .As<BsonDocument>()
                .ToListAsync();

            var postsDtos = posts.Select(post => new PostResultDTO(post)).ToList();

            var totalCount = await _postsCollection.CountDocumentsAsync(post => post.EstateId == estateId);

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

            var commentService = _serviceProvider.GetRequiredService<CommentService>();
            var deleteCommentsResult = await commentService.DeleteManyAsync(existingPost.CommentIds);

            if (deleteCommentsResult.IsError)
                return deleteCommentsResult.Error;

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

    public async Task<Result<bool, ErrorMessage>> RemoveCommentFromPost(string postId, string commentId)
    {
        try
        {
            var filter = Builders<Post>.Filter.Eq(p => p.Id, postId);
            var update = Builders<Post>.Update.Pull(p => p.CommentIds, commentId);

            var updateResult = await _postsCollection.UpdateOneAsync(filter, update);

            if (updateResult.ModifiedCount == 0)
                return "Komentar nije pronađen na postu.".ToError();

            return true;
        }
        catch (Exception)
        {
            return "Došlo je do greške prilikom uklanjanja komentara sa posta.".ToError();
        }
    }

    public async Task<Result<List<PostResultDTO>, ErrorMessage>> GetUserPosts(string userId)
    {
        try
        {
            var posts = await _postsCollection.Aggregate()
                .Match(Builders<Post>.Filter.Eq("AuthorId", ObjectId.Parse(userId)))
                .Lookup("users_collection", "AuthorId", "_id", "AuthorData")
                .Lookup("estates_collection", "EstateId", "_id", "EstateData")
                .As<BsonDocument>()
                .ToListAsync();

            if (!posts.Any())
                return "Korisnik trenutno nema objava.".ToError(404);

            var postDtos = posts.Select(post => new PostResultDTO(post)).ToList();

            return postDtos;
        }
        catch (Exception)
        {
            return "Došlo je do greške prilikom preuzimanja objava.".ToError();
        }
    }

}