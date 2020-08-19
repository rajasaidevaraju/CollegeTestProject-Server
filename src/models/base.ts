import mongoose from "mongoose";
import { MongoError } from "mongodb";
let url: string = process.env.DB_URI!;

export default function initDb(callback: Function) {
  mongoose.connect(
    url,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    },
    connected
  );
  mongoose.set("useCreateIndex", true);

  function connected(err: MongoError) {
    if (err) {
      callback(err);
    }
    console.log("DB initialized - connected to database");
    callback(null);
  }
}
