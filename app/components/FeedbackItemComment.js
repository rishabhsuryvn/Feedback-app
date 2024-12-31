import { useEffect, useState } from "react";
import Button from "./Button";
import Avatar from "./Avatar";
import CommentForm from "./CommentForm";
import axios from "axios";
import Attachments from "./Attachments";
import TimeAgo from "timeago-react";

export default function FeedbackItemComment({ feedbackId }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchComments();
  }, []);

  function fetchComments() {
    axios.get("/api/comment?feedbackId=" + feedbackId).then((res) => {
      setComments(res.data);
    });
  }

  return (
    <div className="p-8">
      {comments?.length > 0 &&
        comments.map((comment, index) => (
          <div className=" mb-8" key={index}>
            <div className="flex gap-4">
              <Avatar url={comment.user.image} />
              <div>
                <p className="text-gray-600">{comment.text}</p>
                <div className="text-gray-400 mt-2 text-sm">
                  {comment.user.name} &middot;{" "}
                  <TimeAgo datetime={comment.createdAt} locale="en-US" />
                </div>
                {comment.uploads?.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {comment.uploads.map((link, index) => (
                      <Attachments link={link} key={index} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

      <CommentForm feedbackId={feedbackId} onPost={fetchComments} />
    </div>
  );
}
