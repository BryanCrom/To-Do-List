import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router";
import api from "../lib/axios.js";
import toast from "react-hot-toast";
import { Loader2Icon, ArrowLeftIcon, Trash2Icon } from "lucide-react";
import RateLimitedUI from "../components/RateLimitedUI.jsx";

const NoteDetailPage = () => {
  const [note, setNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);

  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data);
        setIsRateLimited(false);
      } catch (error) {
        console.log("Error fetching note\n" + error);
        toast.error("Error fetching note");
        if (error.response?.status === 429) {
          setIsRateLimited(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted successfully");
      navigate("/");
      setIsRateLimited(false);
    } catch (error) {
      console.log("Error deleting note\n" + error);
      toast.error("Error deleting note");
      if (error.response?.status === 429) {
        setIsRateLimited(true);
      }
    }
  };

  const handleSave = async () => {
    if (!note.title.trim()) {
      toast.error("Title is required");
      return;
    }

    setIsSaving(true);

    try {
      await api.put(`/notes/${id}`, note);
      toast.success("Note saved successfully");
      navigate("/");
      setIsRateLimited(false);
    } catch (error) {
      console.log("Error saving note\n" + error);
      toast.error("Error saving note");
      if (error.response?.status === 429) {
        setIsRateLimited(true);
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <Loader2Icon className="animate-spin size-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      {isRateLimited && <RateLimitedUI />}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link to={"/"} className="btn btn-ghost">
              <ArrowLeftIcon className="h-5 w-5" />
              Back to Notes
            </Link>
            <button
              onClick={handleDelete}
              className="btn btn-error btn-outline"
            >
              <Trash2Icon className="h-5 w-5" />
              Delete Note
            </button>
          </div>

          <div className="card bg-base-100 border border-base-content/10">
            <div className="card-body">
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  placeholder="Note title"
                  className="input input-bordered"
                  value={note.title}
                  onChange={(e) => setNote({ ...note, title: e.target.value })}
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  placeholder="Write your note here..."
                  className="textarea textarea-bordered h-32"
                  value={note.description}
                  onChange={(e) =>
                    setNote({ ...note, description: e.target.value })
                  }
                />
              </div>

              <div className="card-actions justify-end">
                <button
                  className="btn btn-primary"
                  disabled={isSaving || isRateLimited}
                  onClick={handleSave}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteDetailPage;
