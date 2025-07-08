import { useEffect, useState } from "react";
import api from "../lib/axios.js";
import toast from "react-hot-toast";

import RateLimitedUI from "../components/RateLimitedUI";
import Navbar from "../components/Navbar";
import NoteCard from "../components/NoteCard";
import NotesNotFound from "../components/NotesNotFound.jsx";

const HomePage = () => {
  const [isRateLimited, setIsRateLimted] = useState(false);
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/notes");
        console.log(res.data);
        setNotes(res.data);
        setIsRateLimted(false);
      } catch (error) {
        console.log("Error fetching notes.\n" + error);
        if (error.response?.status === 429) {
          setIsRateLimted(true);
        } else {
          toast.error("Error fetching notes");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      {isRateLimited && <RateLimitedUI />}
      <div className="max-w-7xl mx-auto p-4 mt-6">
        {isLoading && (
          <div className="text-center text-primary py-10">Loading notes...</div>
        )}
        {notes.length === 0 && !isLoading && !isRateLimited && (
          <NotesNotFound />
        )}
        {notes.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                setNotes={setNotes}
                setIsRateLimited={setIsRateLimted}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
