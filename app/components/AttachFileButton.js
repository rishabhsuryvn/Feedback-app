import React from "react";
import { MoonLoader } from "react-spinners";

export default function AttachFileButton({ isUploading, onInputChange }) {
  return (
    <label className={"flex gap-2 py-2 px-4  cursor-pointer"}>
      {isUploading && <MoonLoader size={18} />}

      <span className={isUploading ? "text-blue-400" : "text-gray-600"}>
        {isUploading ? "Uploading..." : "Attach Files"}
      </span>
      <input multiple onChange={onInputChange} type="file" className="hidden" />
    </label>
  );
}
