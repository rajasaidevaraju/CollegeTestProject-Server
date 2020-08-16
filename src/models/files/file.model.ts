import mongoose, { Schema, Document } from "mongoose";

export interface IResolution extends Document {
  width: number;
  height: number;
}

export interface IFile extends Document {
  fileName: string;
  filePath: String;
  size: number;
  resolution: IResolution;
  imagePath?: string;
  GIFRendered?: boolean;
  duration: number;
}

const fileSchema: Schema = new Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
      unique: true,
    },
    size: {
      type: Number,
      required: true,
    },
    resolution: {
      width: {
        type: Number,
        required: true,
      },
      height: {
        type: Number,
        required: true,
      },
    },
    imagePath: {
      type: String,
    },
    GIFRendered: {
      type: Boolean,
      default: false,
    },
    duration: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("fileModel", fileSchema);
