import Popup from "./Popup";
import Button from "./Button";
import { useState } from "react";
import axios from "axios";
import PaperClip from "./icons/PaperClip";
import Trash from "./icons/Trash";
import { set } from "mongoose";
import { MoonLoader } from "react-spinners";
import Attachments from "./Attachments";
import AttachFileButton from "./AttachFileButton";
export default function FeedbackFormPopup({ setShow, onCreate }) {
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
      onCreate();
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
                <Attachments
                  index={index}
                  link={link}
                  showRemoveButton={true}
                  handleRemoveFileClick={(e, link) =>
                    handleRemoveFileClick(e, link)
                  }
                />
              ))}
            </div>
          </div>
        )}
        <div className="flex gap-2 mt-2 justify-end">
          <AttachFileButton />

          <Button type="button" onClick={handleCreatePost} variant="primary">
            Create Post
          </Button>
        </div>
      </form>
    </Popup>
  );
}
