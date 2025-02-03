import {useLocation, useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import {Post} from "../../Interfaces/Post/Post.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import {deletePostAPI, getPostById, updatePostAPI} from "../../Services/PostService.tsx";
import toast from "react-hot-toast";
import {CreateComment} from "../CreateComment/CreateComment.tsx";
import {createCommentAPI, getCommentsForPostAPI} from "../../Services/CommentService.tsx";
import {Comment} from "../../Interfaces/Comment/Comment.ts";
import {CommentCard} from "../CommentCard/CommentCard.tsx";
import {useAuth} from "../../Context/useAuth.tsx";
import Swal from 'sweetalert2';

export const PostPage = () => {

  const {postId} = useParams();
  const {user} = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(location.state?.post || null);
  const [isPostLoading, setIsPostLoading] = useState<boolean>(false);
  const [isCommentsLoading, setIsCommentsLoading] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [totalCommentsCount, setTotalCommentsCount] = useState<number>(0);
  const [newCommentContent, setNewCommentContent] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post?.title || "");
  const [editedContent, setEditedContent] = useState(post?.content || "");
  const [page, setPage] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    if (!post) {
      loadPost();
    }

    setComments([]);
    loadMoreComments();

  }, [postId]);

  useEffect(() => {
    window.scrollTo({
      top: scrollPosition + 380,
      behavior: "instant",
    })
  }, [scrollPosition]);

  const loadPost = async () => {
    try {
      setIsPostLoading(true);
      const response = await getPostById(postId!);
      if (response?.status == 200) {
        setPost(response.data);
        setEditedTitle(response.data.title);
        setEditedContent(response.data.content);
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
      if (!newCommentContent) {
        toast.error("Unesite sadržaj komentara.");
        return;
      }
      const response = await createCommentAPI(newCommentContent, postId!);
      if (response?.status == 200) {
        toast.success("Uspešno dodat komentar.");
        setNewCommentContent('');
        setTotalCommentsCount(total => total + 1);
        setComments(comments => [response.data, ...comments])
      }
    } catch {
      toast.error("Došlo je do greške prilikom kreiranja komentara.");
    }
  }

  const loadMoreComments = async () => {
    try {
      setIsCommentsLoading(true);
      const scrollY = window.scrollY;
      const nextPage = page + 1;
      const response = await getCommentsForPostAPI(postId!, nextPage, 5);
      if (response?.status == 200) {
        const newComments = response.data.data;
        setComments(prevComments => [
          ...prevComments,
          ...newComments.filter(newComment =>
            !prevComments.some(existingComment => existingComment.id === newComment.id)
          ),
        ]);
        setTotalCommentsCount(response.data.totalLength);
        setPage(nextPage)
        setIsCommentsLoading(false);
      }
      setScrollPosition(scrollY);
    } catch {
      toast.error("Došlo je do greške prilikom učitavanja komentara.");
    } finally {
      setIsCommentsLoading(false);
    }
  }

  const confirmDeletion = async () => {
    Swal.fire({
      title: "Da li sigurno želite da obrišete objavu?",
      text: "Uz objavu će biti obrisani i svi njeni komentari!",
      icon: "warning",
      position: "top",
      showCancelButton: true,
      confirmButtonColor: "#8cc4da",
      cancelButtonColor: "#d33",
      cancelButtonText: "Otkaži",
      confirmButtonText: "Obriši"
    }).then(async (result) => {
      if (result.isConfirmed) {
        await handleDelete();
      }
    });
  }

  const handleDelete = async () => {
    try {
      const response = await deletePostAPI(postId!);
      if (response?.status == 204) {
        toast.success("Uspešno brisanje objave.");
        navigate('..');
      }
    } catch {
      toast.error("Došlo je do greške prilikom brisanja objave.");
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedTitle(post?.title || "");
    setEditedContent(post?.content || "");
  };

  const handleSaveEdit = async () => {
    try {
      const response = await updatePostAPI(postId!, editedTitle, editedContent);
      if (response?.status === 200) {
        toast.success("Uspešno izmenjena objava.");
        if(location.state?.post)
          location.state.post = null;
        setPost(prev => {
          return prev ?
            {
              ...prev,
              title: editedTitle,
              content: editedContent,
            } :
            null
        });
        setIsEditing(false);
      }
    } catch {
      toast.error("Došlo je do greške prilikom izmene objave.");
    }
  };

  return (
    <>
      <div className="container mt-4">
        {isPostLoading ?
          (<><p>Učitavanje objave...</p></>) :
          (post && <>
            <div className="post-container p-4 rounded">

              {isEditing ? (
                <div className={`d-flex flex-column gap-2`}>
                  <label htmlFor="postTitle">Naslov</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editedTitle}
                    id="postTitle"
                    onChange={(e) => setEditedTitle(e.target.value)}
                    required
                  />
                  <label htmlFor="postContent">Sadržaj</label>
                  <textarea
                    className="form-control"
                    value={editedContent}
                    id={`postContent`}
                    onChange={(e) => setEditedContent(e.target.value)}
                    required
                  />
                  <div className="mt-2 flex space-x-2">
                    <button onClick={handleSaveEdit}
                            className="bg-blue text-beige border-0 px-3 py-1 rounded"
                            disabled={!editedTitle || !editedContent}>
                      Sačuvaj
                    </button>
                    <button onClick={handleCancelEdit} className="bg-golden text-beige border-0 px-3 py-1 rounded">
                      Otkaži
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-primary">{post.title}</h2>
                  <p className="text-muted">
                    <FontAwesomeIcon icon={faUser} className="me-1"/>
                    {post?.author.username}
                  </p>
                  <p className="content-text">{post.content}</p>

                  {post?.author.id == user?.id &&
                    <div className="d-flex">
                      <button onClick={() => setIsEditing(true)}
                              className={`bg-blue text-beige rounded-2 border-0 px-3 py-1`}>Izmeni
                      </button>
                      <button onClick={confirmDeletion} className={`bg-golden text-beige rounded-2 border-0 px-3 py-1`}>Obriši
                      </button>
                    </div>
                  }
                </>
              )}

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

        <CreateComment content={newCommentContent} setContent={setNewCommentContent}
                       onCommentCreated={handleAddComment}/>

        <h2 className={`mt-3`}>Komentari</h2>

        <div className={`col-md-8 my-5`}>
          {isCommentsLoading ? (<>
            <p className={`text-center text-muted`}>Učitavanje komentara...</p>
          </>) : (
            <>
              {comments.length > 0 && comments.map(comment => (
                <CommentCard key={comment.id} comment={comment}/>
              ))}
            </>
          )}
          {comments.length < totalCommentsCount &&
          <button onClick={loadMoreComments} className={`bg-gray text-blue border-0 rounded-2 px-3 py-1`}>Prikaži još</button>}

        </div>
      </div>
    </>
  );
};