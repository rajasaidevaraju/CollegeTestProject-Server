import mongoose, { Schema, Document } from "mongoose";
export interface IUsers extends Document {
  name: string;
  email: string;
  password: string;
  date: Date;
  role: role;
}

enum role {
  user = "user",
  educator = "educator",
  admin = "admin",
}
const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    enum: ["user", "educator", "admin"],
    default: "user",
  },
});

export default mongoose.model<IUsers>("Users", UserSchema);
