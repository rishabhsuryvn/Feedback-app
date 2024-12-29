import ConnectMongo from "@/app/utils/ConnectMongo";
import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/route";
import { Vote } from "@/app/models/Vote";

export async function GET(req) {
  const url = new URL(req.url);
  if (url.searchParams.get("feedbacksIds")) {
    const feedbacksIds = url.searchParams.get("feedbacksIds").split(",");
    const VoteDocs = await Vote.find({ feedbackId: feedbacksIds });
    return Response.json(VoteDocs);
  }
  return Response.json([]);
}
export async function POST(req) {
  await ConnectMongo();
  const JsonBody = await req.json();
  const { feedbackId } = JsonBody;
  const session = await getServerSession(authOption);
  const { email: userEmail } = session.user;

  //find existing vote
  const existingVote = await Vote.findOne({ feedbackId, userEmail });
  if (existingVote) {
    await Vote.findByIdAndDelete(existingVote._id);
    return Response.json({ existingVote });
  } else {
    const voteDoc = await Vote.create({ feedbackId, userEmail });
    return Response.json(voteDoc);
  }
}
