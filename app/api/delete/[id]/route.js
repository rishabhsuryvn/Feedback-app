import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

export async function DELETE(req, { params }) {
  const fileName = params.id;
  const myS3Client = new S3Client({
    region: "ap-south-1",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });

  await myS3Client.send(
    new DeleteObjectCommand({
      Bucket: "feedbackupload",
      Key: fileName,
    })
  );

  return Response.json({ message: "Deleted" });
}
