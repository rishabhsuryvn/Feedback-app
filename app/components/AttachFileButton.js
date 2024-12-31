import axios from "axios";
import React, { useState } from "react";
import { MoonLoader } from "react-spinners";

export default function AttachFileButton({ onNewFiles }) {
  const [isUploading, setIsUploading] = useState(false);
  async function handleAttachFileInput(e) {
    const files = [...e.target.files];
    setIsUploading(true);
    const data = new FormData();
    for (const file of files) {
      data.append("file", file);
    }
    const res = await axios.post("/api/upload", data);

    onNewFiles(res.data.links || []);
    setIsUploading(false);
  }

  return (
    <label className={"flex gap-2 py-2 px-4  cursor-pointer"}>
      {isUploading && <MoonLoader size={18} />}

      <span className={isUploading ? "text-blue-400" : "text-gray-600"}>
        {isUploading ? "Uploading..." : "Attach Files"}
      </span>
      <input
        multiple
        onChange={handleAttachFileInput}
        type="file"
        className="hidden"
      />
    </label>
  );
}
