import {Comment} from "../../Interfaces/Comment/Comment.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendarAlt, faEdit, faSave, faTimes, faTrash, faUser} from "@fortawesome/free-solid-svg-icons";
import {useAuth} from "../../Context/useAuth.tsx";
import {useState} from "react";
import {updateCommentAPI} from "../../Services/CommentService.tsx";
import toast from "react-hot-toast";

type Props = {
  comment: Comment;
  onDelete: (id: string) => void;
}

export const CommentCard = ({comment:commentFromProps, onDelete}: Props) => {

  const {user} = useAuth();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newContent, setNewContent] = useState(commentFromProps.content);
  const [comment, setComment] = useState<Comment>(commentFromProps);

  const handleSave = async () => {
    try {
      const response = await updateCommentAPI(comment.id, newContent);
      if(response?.status == 200) {
        toast.success("Uspešna izmena komentara.");
        setComment(response.data);
      }
    }
    catch {
      toast.error("Došlo je do greške prilikom izmene komentara.")
    }
    finally {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setNewContent(comment.content);
    setIsEditing(false);
  };

  return (
    <div className="mb-4">
      <div className="d-flex align-items-center mb-2">
        <FontAwesomeIcon icon={faUser} className="text-muted me-2"/>
        <span className="me-2">{comment.author.username}</span>
        <FontAwesomeIcon icon={faCalendarAlt} className="text-muted me-1"/>
        <span className="text-muted text-small">
          {new Date(comment.createdAt).toLocaleDateString("sr")}
        </span>
      </div>

      {isEditing ? (
        <div>
          <textarea
            className="form-control mb-2"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />
          <div className="d-flex justify-content-start">
            <button onClick={handleSave} disabled={!newContent} className="btn btn-primary btn-sm me-2">
              <FontAwesomeIcon icon={faSave}/>
            </button>
            <button onClick={handleCancel} className="btn btn-secondary btn-sm">
              <FontAwesomeIcon icon={faTimes}/>
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-2 text-muted">{comment.content}</p>
      )}

      {user?.id === comment.author.id && (
        <div className="mt-2 d-flex justify-content-start">
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="btn btn-outline-primary btn-sm me-2">
              <FontAwesomeIcon icon={faEdit}/>
            </button>
          )}
          <button onClick={() => onDelete(comment.id)} className="btn btn-outline-danger btn-sm">
            <FontAwesomeIcon icon={faTrash}/>
          </button>
        </div>
      )}
    </div>
  );
};