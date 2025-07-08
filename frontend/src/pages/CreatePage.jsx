import { Link, useNavigate } from "react-router";
import { ArrowLeftIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "../lib/axios.js";

import RateLimitedUI from "../components/RateLimitedUI";

const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/notes", { title, description });
      toast.success("Note created successfully");
      navigate("/");
      setIsRateLimited(false);
    } catch (error) {
      console.error("failed to create note\n" + error);
      toast.error("Failed to create note");
      if (error.response?.status === 429) {
        setIsRateLimited(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      {isRateLimited && <RateLimitedUI />}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link to={"/"} className="btn btn-ghost mb-6">
            <ArrowLeftIcon className="size-5" />
            Back to Notes
          </Link>
          <div className="card bg-base-100 border border-base-content/10">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Create New Note</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Title</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Note title"
                    className="input input-bordered"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Description</span>
                  </label>
                  <textarea
                    placeholder="Write your note here..."
                    className="textarea textarea-bordered h-32"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="card-actions justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading || isRateLimited}
                  >
                    {isLoading ? "Creating..." : "Create Note"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
