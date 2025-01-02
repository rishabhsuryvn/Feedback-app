"use client";
import { useEffect, useRef, useState } from "react";
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
  const [lastId, setLastId] = useState("");
  const [votes, setVotes] = useState([]);
  const [sorts, setSorts] = useState("votes");
  const { data: session, status } = useSession();
  const [pageNo, setPageNo] = useState(1);
  const [isEnd, setIsEnd] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState("");
  const searchRef = useRef("");

  useEffect(() => {
    setFeedbacksLoading(true);
    fetchFeedback();
    setFeedbacksLoading(false);
  }, []);

  useEffect(() => {
    setFeedbacksLoading(true);
    searchRef.current = searchPhrase;
    if (searchPhrase !== "") {
      fetchFeedback();
    }
    setFeedbacksLoading(false);
  }, [sorts, pageNo, searchPhrase]);

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
      .get(
        `/api/feedback?sort=${sorts}&lastId=${lastId}&pageNo=${pageNo}&search=${searchRef.current}`
      )
      .then((res) => {
        const { feedbacksData, hasMore } = res.data;
        setFeedbacks(feedbacksData);
        // setLastId(feedbacksData[feedbacksData.length - 1]._id);
        setIsEnd(!hasMore);
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
      <div className="px-8 mt-4 flex justify-between">
        <div className="flex gap-2 items-center neu-box px-4 ">
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
              d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
            />
          </svg>

          <select
            value={sorts}
            onChange={(e) => setSorts(e.target.value)}
            className="bg-transparent appearance-none text-gray-600 py-2"
          >
            <option value="votes">Most voted</option>
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
        <div className="flex gap-2 items-center neu-box pr-4">
          <input
            type="search"
            placeholder="Search..."
            className="bg-transparent appearance-none px-2 pl-4 rounded-md text-gray-600 py-2"
            value={searchPhrase}
            onChange={(e) => setSearchPhrase(e.target.value)}
          />
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
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>
      </div>
      <div className="px-8 overflow-scroll">
        {feedbacksLoading && (
          <div className="flex flex-col items-center my-8">
            <FadeLoader size={40} loading={true} />
            <p>Loading...</p>
          </div>
        )}
        {!feedbacksLoading && searchPhrase && feedbacks.length === 0 && (
          <div className="flex flex-col items-center my-8">
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856C18.988 19 20 17.988 20 16.662V7.338C20 6.012 18.988 5 17.662 5H6.338C5.012 5 4 6.012 4 7.338v9.324C4 17.988 5.012 19 6.338 19z"
              />
            </svg>
            <p className="text-gray-600">No search results found</p>
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
      {isEnd && (
        <div className="flex flex-col items-center my-8">
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
              d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5"
            />
          </svg>
          <p className="text-gray-600">No more feedbacks</p>
        </div>
      )}
      <div className="flex flex-grow items-center justify-center my-4">
        <button
          className="text-gray-600 disabled:text-gray-400"
          onClick={() => setPageNo(pageNo - 1)}
          disabled={pageNo === 1}
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
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <span className="text-gray-600 mx-4">{pageNo}</span>
        <button
          className="text-gray-600 disabled:text-gray-400"
          onClick={() => setPageNo(pageNo + 1)}
          disabled={isEnd}
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
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>
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
