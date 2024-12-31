import { User } from "./User";

const { Schema, models, model, default: mongoose } = require("mongoose");

const CommentSchema = new Schema(
  {
    text: { type: String },
    uploads: { type: [String] },
    userEmail: { type: String, required: true },
    feedbackId: { type: mongoose.Types.ObjectId, required: true },
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);
CommentSchema.virtual("user", {
  ref: User,
  localField: "userEmail",
  foreignField: "email",
  justOne: true,
});

export const Comment = models?.Comment || model("Comment", CommentSchema);
