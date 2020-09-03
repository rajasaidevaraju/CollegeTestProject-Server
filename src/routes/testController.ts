import { Request, Response, Router } from "express";
import passport from "passport";
import test from "../models/test/test.model";
import submitter from "../models/test/submitter.model";
import TestFunctions from "./../service/test/TestFunctions";
import checkIsInRole from "./../service/utils";
import { role } from "./../models/users/users.model";
let router = Router();
const secretKey = process.env.secretKey;

router.get(
  "/getAllTest",
  passport.authenticate("jwt", { session: false }),
  checkIsInRole(role.educator, role.admin, role.user),
  async (req: any, res: Response) => {
    const userId: string = req.user._id;
    const testObj: TestFunctions = new TestFunctions();

    testObj
      .getTests(userId)
      .then((result) => {
        res.send(result).status(200);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send(err);
      });
  }
);

router.post(
  "/createTest",
  passport.authenticate("jwt", { session: false }),
  checkIsInRole(role.educator, role.admin),
  async (req: any, res: Response) => {
    const _id = req.body._id;
    const userId: string = req.user._id;
    const testName = req.body.testName;

    new TestFunctions()
      .createTest(_id, userId, testName)
      .then((result) => {
        let sendData: any = { testData: {}, message: "success" };
        sendData["testData"][_id] = result;
        res.send(sendData);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }
);

router.post(
  "/saveTest",
  passport.authenticate("jwt", { session: false }),
  checkIsInRole(role.educator, role.admin),
  async (req: any, res: Response) => {
    try {
      await new TestFunctions().saveTest(req.body, req.user);
      res.status(200).send("OK");
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

router.post(
  "/submitTest",
  passport.authenticate("jwt", { session: false }),
  checkIsInRole(role.user),
  (req, res) => {}
);

router.post(
  "/deleteTest",
  passport.authenticate("jwt", { session: false }),
  checkIsInRole(role.educator, role.admin),
  async (req: Request, res: Response) => {
    const _id = req.body._id;
    new TestFunctions()
      .deleteTest(_id)
      .then((result) => {
        res.send({ message: "success" }).status(200);
      })
      .catch((err) => {
        res.send(err).status(500);
      });
  }
);
export default router;
