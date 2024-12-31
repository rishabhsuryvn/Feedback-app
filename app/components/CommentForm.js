import React, { useState } from "react";
import Button from "./Button";
import AttachFileButton from "./AttachFileButton";
import Attachments from "./Attachments";
import axios from "axios";

export default function CommentForm({ feedbackId, onPost }) {
  const [commentText, setCommentText] = useState("");
  const [uploads, setUploads] = useState([]);

  function addUploads(newLink) {
    setUploads((prevLinks) => [
      ...prevLinks,
      ...(Array.isArray(newLink) ? newLink : [newLink]),
    ]);
  }

  async function handleCommentSubmit(e) {
    e.preventDefault();
    await axios.post("/api/comment", {
      text: commentText,
      uploads,
      feedbackId,
    });
    setCommentText("");
    setUploads([]);
    onPost();
  }
  function removeUploads(e, link) {
    e.preventDefault();
    e.stopPropagation();
    setUploads((prevLinks) => prevLinks.filter((val) => val !== link));
    const fileName = link.split("/").pop();
    axios
      .delete(`/api/delete/${fileName}`)
      .then((res) => res.json)
      .then((res) => {
        console.log(res);
      });
  }
  return (
    <form>
      <textarea
        className="border rounded-md w-full p-2"
        placeholder="What's your view.."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
      />
      {uploads?.length > 0 && (
        <div className="">
          <div className="text-sm text-gray-600 mb-2 mt-3">Files:</div>
          <div className="flex gap-3">
            {uploads.map((link, index) => (
              <Attachments
                link={link}
                key={index}
                showRemoveButton={true}
                handleRemoveFileClick={(e, link) => removeUploads(e, link)}
              />
            ))}
          </div>
        </div>
      )}
      <div className="flex justify-end gap-2 mt-2">
        <AttachFileButton onNewFiles={addUploads} />
        <Button
          onClick={handleCommentSubmit}
          variant="primary"
          disabled={commentText === ""}
        >
          Comment
        </Button>
      </div>
    </form>
  );
}
