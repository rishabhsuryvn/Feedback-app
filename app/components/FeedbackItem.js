"use client";
import { useState } from "react";
import Popup from "./Popup";
import Button from "./Button";
import { signIn, useSession } from "next-auth/react";
import axios from "axios";
import { MoonLoader } from "react-spinners";

export default function FeedBackItem({
  _id,
  onOpen,
  title,
  description,
  votes,
  onVotesChange,
  parentLoadingVotes = true,
}) {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isVotesLoading, setIsVotesLoading] = useState(false);
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user?.email;
  function handleVoteButton(e) {
    e.stopPropagation();
    e.preventDefault();
    if (!isLoggedIn) {
      localStorage.setItem("vote_after_login", _id);
      setShowLoginPopup(true);
    } else {
      setIsVotesLoading(true);
      axios.post("/api/vote", { feedbackId: _id }).then(async () => {
        await onVotesChange();
        setIsVotesLoading(false);
      });
    }
  }

  async function handleGoogleLogin(e) {
    e.preventDefault();
    e.stopPropagation();
    await signIn("google");
  }

  return (
    <a
      href=""
      onClick={(e) => {
        e.preventDefault();
        onOpen();
      }}
      className="my-8 flex gap-8 items-center"
    >
      <div className="flex-grow">
        <h2 className="font-bold">{title}</h2>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
      <div>
        {showLoginPopup && (
          <Popup
            title={"Confirm Your Vote !"}
            narrow
            setShow={setShowLoginPopup}
          >
            <div className="p-4">
              <Button primary onClick={handleGoogleLogin}>
                Login
              </Button>
            </div>
          </Popup>
        )}

        {!parentLoadingVotes && (
          <button
            onClick={handleVoteButton}
            className="shadow-sm shadow-gray-200 border rounded-md py-1 px-4 flex items-center gap-1 text-gray-600"
          >
            {!isVotesLoading && (
              <>
                <span className="triangle-vote-up"></span>
                {votes?.length || "0"}
              </>
            )}

            {isVotesLoading && (
              <>
                <MoonLoader size={18} />
              </>
            )}
          </button>
        )}
      </div>
    </a>
  );
}