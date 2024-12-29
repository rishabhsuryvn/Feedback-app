import Feedback from "@/app/models/feedback";
import ConnectMongo from "@/app/utils/ConnectMongo";
import mongoose from "mongoose";

export async function POST(req) {
  const JsonBody = await req.json();
  const { title, description, uploads } = JsonBody;
  await ConnectMongo();

  const feedback = await Feedback.create({ title, description, uploads });

  return new Response(JSON.stringify(feedback), { status: 201 });
}

export async function GET() {
  await ConnectMongo();
  const feedbacks = await Feedback.find();
  return new Response(JSON.stringify(feedbacks), { status: 200 });
}
