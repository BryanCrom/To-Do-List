import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import RateLimitedUI from "../components/RateLimitedUI";
import Navbar from "../components/Navbar";
import NoteCard from "../components/NoteCard";

const HomePage = () => {
  const [isRateLimited, setIsRateLimted] = useState(false);
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5123/notes");
        console.log(res.data);
        setNotes(res.data);
        setIsRateLimted(false);
      } catch (error) {
        console.log("Error fetching notes.\n" + error);
        if (error.response.status === 429) {
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
        {notes.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard key={note._id} note={note} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
