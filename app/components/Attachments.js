import React from "react";
import Image from "next/image";
import PaperClip from "./icons/PaperClip";
import Trash from "./icons/Trash";

export default function Attachments({
  link,
  showRemoveButton = false,
  handleRemoveFileClick,
  index,
}) {
  return (
    <a href={link} target="_blank" className="h-16 relative" key={index}>
      {showRemoveButton && (
        <button
          onClick={(e) => handleRemoveFileClick(e, link)}
          className="-right-2 -top-2 absolute bg-red-400 p-1  rounded-md text-white"
        >
          <Trash />
        </button>
      )}

      {link.endsWith(".jpg") || link.endsWith(".png") ? (
        <Image
          src={link}
          className="rounded-md w-auto"
          alt="attachment"
          width={48}
          height={48}
        />
      ) : (
        <div className="bg-gray-200 h-16 p-2 flex items-center rounded-md">
          <PaperClip className="w-4 h-4" />
          {link.split("/")[3].substring(14)}
        </div>
      )}
    </a>
  );
}
