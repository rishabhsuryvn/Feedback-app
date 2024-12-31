import ConnectMongo from "@/app/utils/ConnectMongo";
import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/route";
import { Comment } from "@/app/models/Comment";
import mongoose from "mongoose";

export async function POST(req) {
  await ConnectMongo();
  const jsonBody = await req.json();
  const session = await getServerSession(authOption);
  const CommentDoc = await Comment.create({
    text: jsonBody.text,
    uploads: jsonBody.uploads,
    userEmail: session.user.email,
    feedbackId: jsonBody.feedbackId,
  });
  return Response.json(CommentDoc);
}

export async function GET(req) {
  await ConnectMongo();
  const url = new URL(req.url);
  if (url.searchParams.get("feedbackId")) {
    const comments = await Comment.find({
      feedbackId: url.searchParams.get("feedbackId"),
    }).populate("user");

    const tranformComment = comments.map((doc) => {
      const { userEmail, ...rest } = doc.toJSON();
      const { email, ...userWithoutEmail } = rest.user;
      rest.user = userWithoutEmail;
      return rest;
    });
    return new Response(JSON.stringify(tranformComment), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  }

  return new Response(JSON.stringify(false));
}
