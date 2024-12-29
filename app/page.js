"use client";
import { useEffect, useState } from "react";
import FeedBackItem from "./components/FeedbackItem";
import FeedbackFormPopup from "./components/FeedbackFormPopup";
import Button from "./components/Button";
import FeedBackItemPopup from "./components/FeedBackItemPopup";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function Home() {
  const [showFeedBackPopup, setShowFeedBackPopup] = useState(false);
  const [showFeedBackItem, setShowFeedBackItem] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [votes, setVotes] = useState([]);
  const { data: session } = useSession();
  const [votesLoading, setVotesLoading] = useState(false);

  useEffect(() => {
    axios
      .get("/api/feedback")
      .then((res) => {
        setFeedbacks(res.data);
      })
      .catch((err) => {
        console.error("Error fetching feedbacks:", err);
        alert("Failed to fetch feedbacks. Please try again later.");
      });
  }, []);

  useEffect(() => {
    fetchVotes();
  }, [feedbacks]);

  useEffect(() => {
    if (session?.user?.email) {
      const feedbackId = localStorage.getItem("vote_after_login");
      if (feedbackId) {
        axios.post("/api/vote", { feedbackId });
        localStorage.removeItem("vote_after_login");
      }
    }
  }, [session?.user?.email]);

  async function fetchVotes() {
    setVotesLoading(true);
    const ids = feedbacks.map((f) => f._id);
    const res = await axios.get("/api/vote?feedbacksIds=" + ids.join(","));
    setVotes(res.data);
    setVotesLoading(false);
  }
  function openFeedBackPopup() {
    setShowFeedBackPopup(true);
  }

  function openFeedBackItem(feedback) {
    setShowFeedBackItem(feedback);
  }

  return (
    <main className="bg-white md:max-w-2xl mx-auto md:shadow-lg md:rounded-lg md:mt-8 overflow-hidden">
      {session?.user?.email || "Not logged in"}
      <div className="bg-gradient-to-r from-cyan-400 to-blue-400 p-8">
        <h1 className="font-bold text-xl">Rishabh</h1>
        <p className="text-opacity-90 text-slate-700">
          help me to decide what can I build next or how can I improve
        </p>
      </div>
      <div className="bg-gray-100 px-8 py-2 flex border-b">
        <div className="grow"></div>
        <div>
          <Button primary="true" onClick={openFeedBackPopup}>
            Make a suggestion{" "}
          </Button>
        </div>
      </div>
      <div className="px-8">
        {feedbacks.map((feedback, index) => (
          <FeedBackItem
            {...feedback}
            key={index}
            onVotesChange={fetchVotes}
            votes={votes.filter(
              (v) => v.feedbackId.toString() === feedback._id.toString()
            )}
            onOpen={() => openFeedBackItem(feedback)}
            parentLoadingVotes={votesLoading}
          />
        ))}
      </div>
      {showFeedBackPopup && (
        <FeedbackFormPopup setShow={setShowFeedBackPopup} />
      )}

      {showFeedBackItem && (
        <FeedBackItemPopup
          {...showFeedBackItem}
          setShow={setShowFeedBackItem}
        />
      )}
    </main>
  );
}
