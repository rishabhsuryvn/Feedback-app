import Button from "./Button";
import FeedbackItemComment from "./FeedbackItemComment";

import Popup from "./Popup";

export default function FeedBackItemPopup({
  title,
  description,
  votesCount,
  setShow,
}) {
  return (
    <Popup title={""} setShow={setShow}>
      <div className="p-8 pb-2 ">
        <h2 className="text-lg font-bold mb-2"> {title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
      <div className="flex justify-end  border-b px-8 py-2">
        <Button primary="true">
          <span className="triangle-vote-up"></span>
          Upvote {votesCount}
        </Button>
      </div>
      <div>
        <FeedbackItemComment />
      </div>
    </Popup>
  );
}
