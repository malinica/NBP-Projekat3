import {Post} from "../../Interfaces/Post/Post.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";

type Props = {
  post: Post;
}

export const PostCard = ({post}:Props) => {
  return (
    <div className={`card mb-4 shadow`}>
      <div className={`card-body d-flex justify-content-between`}>
        <div className={`left-content`}>
          <h3 className={`text-gray`}>{post.title}</h3>
          <p className={`text-golden`}>
            <FontAwesomeIcon icon={faUser} className={`me-1`}/>
            {post.author.username}</p>
          <p className={`card-text content-text`}>{post.content}</p>
        </div>

        {post.estate && (
          <div className={`estate-card card`}>
            <div className={`card-body`}>
              <h5 className={`card-title`}>Ako se odnosi na nekretninu</h5>
              <img
                src="https://picsum.photos/200/200"
                alt="Estate placeholder"
                className={`img-fluid`}
              />
              <p className={`card-text`}>Onda ovde nesto dodatno</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};