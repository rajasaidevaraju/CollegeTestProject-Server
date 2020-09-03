import mongoose, { Schema, Document } from "mongoose";

export interface IClass extends Document {
  className: string;
}

const classSchema: Schema = new Schema(
  {
    className: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Class", classSchema);
