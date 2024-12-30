import React, { useState } from "react";
import Button from "./Button";
import AttachFileButton from "./AttachFileButton";

export default function CommentForm() {
  const [commentText, setCommentText] = useState("");
  return (
    <form>
      <textarea
        className="border rounded-md w-full p-2"
        placeholder="What's your view.."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
      />
      <div className="flex justify-end gap-2 mt-2">
        <AttachFileButton isUploading={false} onInputChange={() => {}} />
        <Button variant="primary" disabled={commentText === ""}>
          Comment
        </Button>
      </div>
    </form>
  );
}
