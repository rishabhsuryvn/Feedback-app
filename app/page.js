"use client";
import { useEffect, useState } from "react";
import FeedBackItem from "./components/FeedbackItem";
import FeedbackFormPopup from "./components/FeedbackFormPopup";
import Button from "./components/Button";
import FeedBackItemPopup from "./components/FeedBackItemPopup";
import axios from "axios";
import { useSession } from "next-auth/react";
import Header from "./components/Header";
import { FadeLoader } from "react-spinners";
import Popup from "./components/Popup";
import { signIn } from "next-auth/react";

export default function Home() {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showFeedBackPopup, setShowFeedBackPopup] = useState(false);
  const [showFeedBackItem, setShowFeedBackItem] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbacksLoading, setFeedbacksLoading] = useState(true);
  const [votesLoading, setVotesLoading] = useState(false);
  const [votes, setVotes] = useState([]);
  const { data: session, status } = useSession();

  useEffect(() => {
    fetchFeedback();
    setFeedbacksLoading(false);
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
  async function handleGoogleLogin(e) {
    e.preventDefault();
    e.stopPropagation();
    await signIn("google");
  }
  async function fetchVotes() {
    setVotesLoading(true);
    const ids = feedbacks.map((f) => f._id);
    const res = await axios.get("/api/vote?feedbacksIds=" + ids.join(","));
    setVotes(res.data);
    setVotesLoading(false);
  }
  function openFeedBackPopup() {
    if (!isLoggedIn) {
      setShowLoginPopup(true);
      return;
    }
    setShowFeedBackPopup(true);
  }

  function openFeedBackItem(feedback) {
    setShowFeedBackItem(feedback);
  }

  const isLoggedIn = !!session?.user?.email;
  return (
    <main className="neu-box md:max-w-2xl mx-auto md:shadow-lg md:rounded-lg md:mt-8 overflow-hidden relative">
      <Header />
      {showLoginPopup && (
        <Popup title={"Login to post"} narrow setShow={setShowLoginPopup}>
          <div className="p-4">
            <Button variant="primary" onClick={handleGoogleLogin}>
              Login
            </Button>
          </div>
        </Popup>
      )}
      <div className="bg-gradient-to-r h-40 from-sky-400 to-blue-400 p-8">
        <h1 className="font-bold text-xl">
          {isLoggedIn && <span>Hello, {session?.user?.name}</span>}
          {!isLoggedIn && (
            <>
              <span>Hello, {status === "loading" ? "..." : "Guest"}</span>
            </>
          )}
        </h1>
        <p className="text-opacity-90 text-slate-700 mb-8">
          Share Your Thoughts with Us
        </p>
        <Button
          variant="primary"
          className="hover:border hover:border-sky-200"
          onClick={openFeedBackPopup}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
          Post
        </Button>
      </div>

      <div className="px-8 overflow-scroll">
        {feedbacksLoading && (
          <div className="flex flex-col items-center my-8">
            <FadeLoader size={40} loading={true} />
            <p>Loading...</p>
          </div>
        )}
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
