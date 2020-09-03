import mongoose, { Schema, Document, Types } from "mongoose";
enum submission_type {
  answer = "answer",
  submission = "submission",
}
const submitterSchema: Schema = new Schema(
  {
    userID: { type: Schema.Types.ObjectId, ref: "users" },
    quizID: { type: String, required: true },
    answers: {
      type: Object,
    },
    submission_type: {
      type: String,
      enum: ["answer", "submission"],
      default: "submission",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("submitter", submitterSchema);
