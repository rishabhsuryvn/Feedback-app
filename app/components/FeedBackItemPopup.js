import axios from "axios";
import Button from "./Button";
import FeedbackItemComment from "./FeedbackItemComment";

import Popup from "./Popup";
import { useState } from "react";
import { set } from "mongoose";
import { MoonLoader } from "react-spinners";
import { useSession } from "next-auth/react";
import Tick from "./icons/Tick";
import Attachments from "./Attachments";

export default function FeedBackItemPopup({
  title,
  description,
  _id,
  votes,
  setShow,
  onVoteChange,
  uploads,
}) {
  const [votesLoading, setVotesLoading] = useState(false);
  const { data: session } = useSession();
  function handleVoteButton() {
    setVotesLoading(true);
    axios.post("/api/vote", { feedbackId: _id }).then(async () => {
      await onVoteChange();
      setVotesLoading(false);
    });
  }

  const iVoted = votes.find((v) => v.userEmail === session?.user?.email);
  return (
    <Popup title={""} setShow={setShow}>
      <div className="p-8 pb-2 ">
        <h2 className="text-lg font-bold mb-2"> {title}</h2>
        <p className="text-gray-600">{description}</p>
        {uploads.length > 0 && (
          <div className="mt-4">
            <span className="text-sm text-gray-600">Attachments:</span>
            <div className="flex gap-2">
              {uploads.map((link, index) => (
                <Attachments link={link} key={index} />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-end  border-b px-8 py-2">
        <Button onClick={handleVoteButton} variant="primary">
          {votesLoading && <MoonLoader size={18} />}
          {!votesLoading && (
            <>
              {iVoted && (
                <>
                  <Tick className="w-4 h-4" />
                  Upvoted {votes?.length || "0"}
                </>
              )}
              {!iVoted && (
                <>
                  <span className="triangle-vote-up"></span>
                  Upvote {votes?.length || "0"}
                </>
              )}
            </>
          )}
        </Button>
      </div>
      <div>
        <FeedbackItemComment />
      </div>
    </Popup>
  );
}
