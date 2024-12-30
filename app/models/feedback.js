const { Schema, model, models } = require("mongoose"); // Correct import for `model`

const feedbackSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    email: { type: String, required: true },
    uploads: { type: [String] },

    // ip: { type: String, required: true },
  },
  { timestamps: true }
);

// Use `model` instead of `mongoose.model`, as you're already destructuring `model` from Mongoose
const Feedback = models?.Feedback || model("Feedback", feedbackSchema);

module.exports = Feedback; // Correct export for the Feedback model
