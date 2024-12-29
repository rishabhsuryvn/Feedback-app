import { useState } from "react";
import Button from "./Button";
import Avatar from "./Avatar";

export default function FeedbackItemComment() {
  const [commentText, setCommentText] = useState("");
  return (
    <div className="p-8">
      <div className="flex gap-4 mb-8">
        <Avatar />
        <div>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.{" "}
          </p>
          <div className="text-gray-400 mt-2 text-sm">
            Anonymous &middot; a few seconds ago
          </div>
        </div>
      </div>
      <form>
        <textarea
          className="border rounded-md w-full p-2"
          placeholder="What's your view.."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <div className="flex justify-end gap-2 mt-2">
          <Button>Attach Files</Button>
          <Button primary="true" disabled={commentText === ""}>
            Comment
          </Button>
        </div>
      </form>
    </div>
  );
}
