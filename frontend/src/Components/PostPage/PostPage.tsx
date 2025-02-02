import {useLocation, useParams} from "react-router";
import {useEffect, useState} from "react";
import {Post} from "../../Interfaces/Post/Post.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import {getPostById} from "../../Services/PostService.tsx";
import toast from "react-hot-toast";
import {CreateComment} from "../CreateComment/CreateComment.tsx";
import {createCommentAPI, getCommentsForPostAPI} from "../../Services/CommentService.tsx";
import {Comment} from "../../Interfaces/Comment/Comment.ts";
import {PostCard} from "../PostCard/PostCard.tsx";
import {Pagination} from "../Pagination/Pagination.tsx";

export const PostPage = () => {

  const {postId} = useParams();
  const location = useLocation();
  const [post, setPost] = useState<Post | null>(location.state?.post || null);
  const [isPostLoading, setIsPostLoading] = useState<boolean>(false);
  const [isCommentsLoading, setIsCommentsLoading] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [totalCommentsCount, setTotalCommentsCount] = useState<number>(0);
  const [content, setContent] = useState<string>(""); //za novi komentar

  useEffect(() => {
    if (!post) {
      loadPost();
    }

    loadComments(1, 10);

  }, [postId]);

  const loadPost = async () => {
    try {
      setIsPostLoading(true);
      const response = await getPostById(postId!);
      if (response?.status == 200) {
        setPost(response.data);
        setIsPostLoading(false);
      }
    } catch {
      toast.error("Došlo je do greške prilikom učitavanja objave.");
    } finally {
      setIsPostLoading(false);
    }
  }

  const handleAddComment = async () => {
    try {
      if (!content) {
        toast.error("Unesite sadržaj komentara.");
        return;
      }
      const response = await createCommentAPI(content, postId!);
      if (response?.status == 200) {
        toast.success("Uspešno dodat komentar.");
        setContent('');
        await loadComments(1, 10);
      }
    } catch {
      toast.error("Došlo je do greške prilikom kreiranja komentara.");
    }
  }

  const handlePaginateChange = async (page: number, pageSize: number) => {
    await loadComments(page, pageSize);
  }

  const loadComments = async (page: number, pageSize: number) => {
    try {
      setIsCommentsLoading(true);
      const response = await getCommentsForPostAPI(postId!, page, pageSize);
      if (response?.status == 200) {
        setComments(response.data.data);
        setTotalCommentsCount(response.data.totalLength);
        setIsCommentsLoading(false);
      }
    } catch {
      toast.error("Došlo je do greške prilikom učitavanja komentara.");
    } finally {
      setIsCommentsLoading(false);
    }
  }

  return (
    <>
      <div className="container mt-4">
        {isPostLoading ?
          (<><p>Učitavanje objave...</p></>) :
          (post && <>
            <div className="post-container p-4 rounded">
              <h2 className="text-primary">{post.title}</h2>
              <p className="text-muted">
                <FontAwesomeIcon icon={faUser} className="me-1"/>
                {post?.author.username}
              </p>
              <p className="content-text">{post.content}</p>

              {post.estate && (
                <div className="estate-container mt-4 p-3 border rounded">
                  <h5>Odnosi se na nekretninu</h5>
                  <img
                    src="https://picsum.photos/300/200"
                    alt="Estate placeholder"
                    className="img-fluid"
                  />
                  <p>Dodatne informacije o nekretnini</p>
                </div>
              )}
            </div>
          </>)}

        <CreateComment content={content} setContent={setContent} onCommentCreated={handleAddComment}/>

        <h2 className={`mt-3`}>Komentari</h2>

        <div className={`col-md-8 my-5`}>
          {isCommentsLoading ? (<>
            <p className={`text-center text-muted`}>Učitavanje komentara...</p>
          </>) : (
            <>
              {comments.length > 0 && comments.map(comment => (
                <p key={comment.id}>{comment.content}</p>
              ))}
            </>
          )}
          {totalCommentsCount > 0 &&
            <Pagination totalLength={totalCommentsCount} onPaginateChange={handlePaginateChange}/>}

        </div>
      </div>
    </>
  );
};