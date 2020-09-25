import mongoose, { Schema, Document, Types } from "mongoose";

enum type {
  singleOption = "singleOpion",
  multipleOption = "multipleOption",
}

const quizSchema: Schema = new Schema(
  {
    _id: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "users" },
    testName: {
      type: String,
    },
    questions: {
      type: Object,
    },
  },
  {
    timestamps: true,
    _id: false,
  }
);

export default mongoose.model("quizModel", quizSchema);
