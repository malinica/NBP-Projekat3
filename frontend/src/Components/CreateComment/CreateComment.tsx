type Props = {
  content: string;
  setContent: (content: string) => void;
  onCommentCreated: () => void;
}

export const CreateComment = ({onCommentCreated, setContent, content}: Props) => {
  return (
    <>
      <div className="create-comment">
        <div className="mb-3">
        <textarea
          className="form-control"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Unesite komentar"
          rows={3}
        />
        </div>
        <button
          className="btn btn-primary"
          onClick={onCommentCreated}
          disabled={!content.trim()}
        >
          Kreiraj komentar
        </button>
      </div>
    </>
  );
};