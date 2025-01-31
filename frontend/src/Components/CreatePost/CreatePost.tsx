import {useState} from "react";
import toast from "react-hot-toast";

type Props = {
  onCreatePost: (title: string, content: string) => Promise<void>;
}

export const CreatePost = ({onCreatePost}:Props) => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const handleSubmit = async () => {
    if (!title || !content) {
      toast.error("Molimo vas da popunite sve obavezne podatke.");
      return;
    }

    onCreatePost(title, content).then(_ => {
      setTitle("");
      setContent("");
    });
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Kreiraj novu objavu</h2>
      <div className="card p-4">
        <div className="form-group mb-3">
          <label htmlFor="title" className="form-label">
            Naslov
          </label>
          <input
            type="text"
            id="title"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Unesite naslov..."
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="content" className="form-label">
            Sadržaj
          </label>
          <textarea
            id="content"
            className="form-control"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            placeholder="Unesite sadržaj objave..."
          />
        </div>

        <button
          className="btn btn-primary w-100"
          onClick={handleSubmit}
        >
          Objavi
        </button>
      </div>
    </div>
  );
};