import {CreatePost} from "../CreatePost/CreatePost.tsx";
import toast from "react-hot-toast";
import {createPostAPI, getAllPostsAPI} from "../../Services/PostService.tsx";
import {CreatePostDTO} from "../../Interfaces/Post/CreatePostDTO.ts";
import {useEffect, useState} from "react";
import {Post} from "../../Interfaces/Post/Post.ts";
import {PostCard} from "../PostCard/PostCard.tsx";
import {Pagination} from "../Pagination/Pagination.tsx";


export const ForumPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPostsCount, setTotalPostsCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pageSize, setPageSize] = useState<number>(10);

  useEffect(() => {
    loadPosts(1,10);
  }, []);

  const handleCreatePost = async (title: string, content: string) => {
    try {
      const postDto: CreatePostDTO = {
        title,
        content,
        estateId: null
      }
      const response = await createPostAPI(postDto);

      if(response?.status == 200) {
        toast.success("Uspešno kreirana objava.");
        await loadPosts(1, pageSize);
      }
    }
    catch {
      toast.error("Došlo je do greške prilikom kreiranja objave.");
    }
  }

  const handlePaginateChange = async (page: number, pageSize: number) => {
    setPageSize(pageSize);
    await loadPosts(page, pageSize);
  }

  const loadPosts = async (page: number, pageSize: number) => {
    try {
      setIsLoading(true);
      const response = await getAllPostsAPI(page, pageSize);

      if(response?.status == 200){
        setPosts(response.data.data);
        setTotalPostsCount(response.data.totalLength);
      }
    }
    catch {
      toast.error("Došlo je do greške prilikom učitavanja objava.");
    }
    finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={`container-fluid bg-beige`}>
      <div className={`row`}>
        <div className={`col-md-4`}>
          <CreatePost onCreatePost={handleCreatePost}/>
        </div>
      
        <div className={`col-md-8 my-5`}>
          <h2 className={`text-blue`}>Objave</h2>
          {isLoading ? (<>
            <p className={`text-center text-muted`}>Učitavanje objava...</p>
          </>) : (
            <>
              {posts.length > 0 && posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </>
          )}
          {totalPostsCount > 0 &&
          <Pagination totalLength={totalPostsCount} onPaginateChange={handlePaginateChange}/>}
        </div>
      </div>
    </div>
  );
};