import Popup from "./Popup";
import Button from "./Button";
import { useState } from "react";
import axios from "axios";
import Attachments from "./Attachments";
import AttachFileButton from "./AttachFileButton";
import { useSession } from "next-auth/react";
export default function FeedbackFormPopup({ setShow, onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploads, setUploads] = useState([]);
  const { data: session } = useSession();
  const email = session?.user?.email;
  function handleCreatePost(e) {
    e.preventDefault();
    if (!title || !description) {
      console.log("Title and description cannot be empty");
      return;
    }
    axios
      .post("/api/feedback", { title, description, email, uploads })
      .then((res) => {
        setShow(false);
        onCreate();
      });
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

  function addNewUploads(newLink) {
    setUploads((prevLinks) => [
      ...prevLinks,
      ...(Array.isArray(newLink) ? newLink : [newLink]),
    ]);
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
                  key={index}
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
          <AttachFileButton onNewFiles={addNewUploads} />

          <Button type="button" onClick={handleCreatePost} variant="primary">
            Create Post
          </Button>
        </div>
      </form>
    </Popup>
  );
}
