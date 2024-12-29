import Popup from "./Popup";
import Button from "./Button";
import { useState } from "react";
import axios from "axios";
import PaperClip from "./icons/PaperClip";
import Trash from "./icons/Trash";
import { set } from "mongoose";
import { MoonLoader } from "react-spinners";
export default function FeedbackFormPopup({ setShow }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploads, setUploads] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  function handleCreatePost(e) {
    e.preventDefault();
    if (!title || !description) {
      console.log("Title and description cannot be empty");
      return;
    }
    axios.post("/api/feedback", { title, description, uploads }).then((res) => {
      setShow(false);
    });
  }

  async function handleAttachFileInput(e) {
    const files = [...e.target.files];
    setIsUploading(true);
    const data = new FormData();
    for (const file of files) {
      data.append("file", file);
    }
    const res = await axios.post("/api/upload", data);
    // console.log(res.data);

    setUploads((existingUpload) => {
      return [...existingUpload, ...res.data.links];
    });
    setIsUploading(false);
  }

  async function handleRemoveFileClick(e, link) {
    e.preventDefault();
    setUploads((currUpload) => {
      return currUpload.filter((val) => val !== link);
    });
    const fileName = link.split("/").pop();
    axios
      .delete(`/api/delete/${fileName}`)
      .then((res) => res.json)
      .then((res) => {
        console.log(res);
      });
  }
  return (
    <Popup setShow={setShow} title={"Make a suggestion"}>
      <form className="p-8 ">
        <label className=" block mt-4 mb-1 text-slate-700">Title</label>
        <input
          className="w-full border p-2 rounded-md"
          type="text"
          placeholder="A short, descriptive title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label className="block mt-4 mb-1 text-slate-700">Details</label>
        <textarea
          className="w-full border  p-2 rounded-md"
          placeholder="Please include any details"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {uploads?.length > 0 && (
          <div>
            <label className="block mt-2 mb-1 text-slate-600">Files</label>
            <div className="flex gap-3">
              {uploads.map((link, index) => (
                <a
                  href={link}
                  target="_blank"
                  className="h-16 relative"
                  key={index}
                >
                  <button
                    onClick={(e) => handleRemoveFileClick(e, link)}
                    className="-right-2 -top-2 absolute bg-red-400 p-1  rounded-md text-white"
                  >
                    <Trash />
                  </button>
                  {link.endsWith(".jpg") || link.endsWith(".png") ? (
                    <img className="h-16 w-auto rounded-md" src={link} alt="" />
                  ) : (
                    <div className="bg-gray-200 h-16 p-2 flex items-center rounded-md">
                      <PaperClip className="w-4 h-4" />
                      {link.split("/")[3].substring(14)}
                    </div>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}
        <div className="flex gap-2 mt-2 justify-end">
          <label className={"flex gap-2 py-2 px-4  cursor-pointer"}>
            {isUploading && <MoonLoader size={18} />}

            <span className={isUploading ? "text-gray-200" : "text-gray-600"}>
              {isUploading ? "Uploading..." : "Attach Files"}
            </span>
            <input
              multiple
              onChange={handleAttachFileInput}
              type="file"
              className="hidden"
            />
          </label>

          <Button type="button" onClick={handleCreatePost} primary="true">
            Create Post
          </Button>
        </div>
      </form>
    </Popup>
  );
}