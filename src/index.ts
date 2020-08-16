require("dotenv").config({ path: __dirname + "/.env" });
import express, { Application } from "express";
import bodyParser from "body-parser";
import router from "./routes/videoController";
import userRouter from "./routes/userController";
import testRouter from "./routes/testController";
import initDb from "./models/base";
import passport from "passport";
import cookieParser from "cookie-parser";
require("./service/passport")(passport);

const os = require("os");
const port = process.env.PORT;
const cors = require("cors");
const app: Application = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());
app.use("/", router);
app.use("/test", testRouter);
app.use("/api/users", userRouter);
app.use(passport.initialize());

initDb((err: any) => {
  if (err) {
    throw err;
  }
  app.listen(port, () => {
    os.networkInterfaces().Ethernet.map((obj: any) => {
      if (obj.family == "IPv4") {
        console.log(
          "server is listening on http:\\\\" + obj.address + ":" + port
        );
      }
    });
  });
});
