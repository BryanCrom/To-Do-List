import { Link } from "react-router";
import { PenSquareIcon, Trash2Icon } from "lucide-react";
import { formatDate } from "../lib/utils";
import toast from "react-hot-toast";
import api from "../lib/axios.js";

const NoteCard = ({ note, setNotes, setIsRateLimited }) => {
  const handleDelete = async (e, id) => {
    e.preventDefault();

    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted successfully");
      setNotes((prev) => prev.filter((note) => note._id !== id));
      setIsRateLimited(false);
    } catch (error) {
      if (error.response?.status === 429) {
        console.log("Too many requests\n" + error);
        setIsRateLimited(true);
      } else {
        console.log("failed to delete note\n" + error);
        toast.error("Failed to delete note");
      }
    }
  };

  return (
    <Link
      to={`/note/${note._id}`}
      className="card bg-base-100 hover:shadow-lg transition-all duration-200 border-t-4 border-solid border-[#00FF9D]"
    >
      <div className="card-body">
        <h3 className="card-title text-base-content">{note.title}</h3>
        <p className="text-base-content/70 line-clamp-3">{note.description}</p>
        <div className="card-actions justify-between items-center mt-4">
          <span className="text-sm text-base-content/60">
            {formatDate(new Date(note.createdAt))}
          </span>
          <div className="flex items-center gap-1">
            <PenSquareIcon className="size-4" />
            <button
              onClick={(e) => handleDelete(e, note._id)}
              className="btn btn-ghost btn-xs text-error"
            >
              <Trash2Icon className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NoteCard;
