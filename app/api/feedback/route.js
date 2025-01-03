import Feedback from "@/app/models/feedback";
import ConnectMongo from "@/app/utils/ConnectMongo";

export async function POST(req) {
  const JsonBody = await req.json();
  const { title, description, email, uploads } = JsonBody;
  await ConnectMongo();

  const feedback = await Feedback.create({
    title,
    description,
    email,
    uploads,
  });

  return new Response(JSON.stringify(feedback), { status: 201 });
}

export async function GET(req) {
  const url = new URL(req.url);
  await ConnectMongo();
  const sortParam = url.searchParams.get("sort");
  const lastId = url.searchParams.get("lastId");
  const pageNo = url.searchParams.get("pageNo");
  const searchPhrase = url.searchParams.get("search");

  const limit = 3;
  let sort;
  if (sortParam === "latest") {
    sort = { createdAt: -1 };
  }
  if (sortParam === "oldest") {
    sort = { createdAt: 1 };
  }
  if (sortParam === "votes") {
    sort = { voteCounted: -1 };
  }

  const searchQuery = searchPhrase
    ? {
        $or: [
          { title: { $regex: searchPhrase, $options: "i" } },
          { description: { $regex: searchPhrase, $options: "i" } },
        ],
      }
    : {};

  const feedbacksData = await Feedback.find(searchQuery)
    .sort(sort)
    .limit(limit + 1)
    .skip(limit * (pageNo - 1));
  const hasMore = feedbacksData.length > limit;

  if (hasMore) {
    feedbacksData.pop();
  }
  return new Response(JSON.stringify({ feedbacksData, hasMore }), {
    status: 200,
  });
}
