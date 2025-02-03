import {Comment} from "../../Interfaces/Comment/Comment.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendarAlt, faUser} from "@fortawesome/free-solid-svg-icons";

type Props = {
  comment: Comment;
}

export const CommentCard = ({comment}: Props) => {
  return (
    <>
      <div className="text-sm mb-4">
        <div className="flex items-center space-x-2">
          <FontAwesomeIcon icon={faUser} className="text-gray-500"/>
          <span className={`me-2`}>{comment.author.username}</span>
          <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-500 text-xs" />
          <span className="text-gray-500 text-xs">
            {new Date(comment.createdAt).toLocaleDateString("sr")}
          </span>
        </div>
        <p className="mt-1 text-gray-800">{comment.content}</p>
      </div>
    </>
  );
};