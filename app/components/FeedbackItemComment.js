import { useState } from "react";
import Button from "./Button";
import Avatar from "./Avatar";
import CommentForm from "./CommentForm";

export default function FeedbackItemComment() {
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
      <CommentForm />
    </div>
  );
}
