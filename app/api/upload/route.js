import {
  PutObjectCommand,
  S3Client,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

export async function POST(req) {
  const myS3Client = new S3Client({
    region: "ap-south-1",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });

  const formData = await req.formData();
  const links = [];
  const files = formData.getAll("file");
  let fileName = "";
  for (const file of files) {
    if (file) {
      const name = `${Date.now()}-${file.name}`;
      fileName = name;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      await myS3Client.send(
        new PutObjectCommand({
          Bucket: "feedbackupload",
          Key: name,
          ACL: "public-read",
          Body: buffer,
          ContentType: file.type,
        })
      );

      links.push("https://feedbackupload.s3.amazonaws.com/" + name);
    }
  }

  return Response.json({ links, fileName });
}
