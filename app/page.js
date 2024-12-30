"use client";
import { useEffect, useState } from "react";
import FeedBackItem from "./components/FeedbackItem";
import FeedbackFormPopup from "./components/FeedbackFormPopup";
import Button from "./components/Button";
import FeedBackItemPopup from "./components/FeedBackItemPopup";
import axios from "axios";
import { useSession } from "next-auth/react";
import Header from "./components/Header";

export default function Home() {
  const [showFeedBackPopup, setShowFeedBackPopup] = useState(false);
  const [showFeedBackItem, setShowFeedBackItem] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [votesLoading, setVotesLoading] = useState(false);
  const [votes, setVotes] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    fetchFeedback();
  }, []);

  useEffect(() => {
    fetchVotes();
  }, [feedbacks]);

  useEffect(() => {
    if (session?.user?.email) {
      const feedbackId = localStorage.getItem("vote_after_login");
      if (feedbackId) {
        axios.post("/api/vote", { feedbackId }).then(() => {
          localStorage.removeItem("vote_after_login");
          fetchVotes();
        });
      }
    }
  }, [session?.user?.email]);

  async function fetchFeedback() {
    axios
      .get("/api/feedback")
      .then((res) => {
        setFeedbacks(res.data);
      })
      .catch((err) => {
        console.error("Error fetching feedbacks:", err);
        alert("Failed to fetch feedbacks. Please try again later.");
      });
  }
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

  const isLoggedIn = !!session?.user?.email;
  return (
    <main className="bg-white md:max-w-2xl mx-auto md:shadow-lg md:rounded-lg md:mt-8 overflow-hidden">
      <Header />
      <div className="bg-gradient-to-r from-cyan-400 to-blue-400 p-8">
        <h1 className="font-bold text-xl">
          {isLoggedIn && (
            <>
              <span>Hello, {session?.user?.name}</span>
            </>
          )}
          {!isLoggedIn && (
            <>
              <span>Hello, Guest</span>
            </>
          )}
        </h1>
        <p className="text-opacity-90 text-slate-700">
          Share Your Thoughts with Us
        </p>
      </div>
      <div className="bg-gray-100 px-8 py-2 flex border-b">
        <div className="grow"></div>
        <div>
          <Button variant="primary" onClick={openFeedBackPopup}>
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
            parentLoadingVotes={votesLoading}
            onOpen={() => openFeedBackItem(feedback)}
          />
        ))}
      </div>
      {showFeedBackPopup && (
        <FeedbackFormPopup
          onCreate={fetchFeedback}
          setShow={setShowFeedBackPopup}
        />
      )}

      {showFeedBackItem && (
        <FeedBackItemPopup
          {...showFeedBackItem}
          votes={votes.filter(
            (v) => v.feedbackId.toString() === showFeedBackItem._id.toString()
          )}
          onVoteChange={fetchVotes}
          setShow={setShowFeedBackItem}
        />
      )}
    </main>
  );
}
