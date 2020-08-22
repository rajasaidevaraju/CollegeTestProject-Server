import { Request, Response, Router } from "express";
import passport from "passport";
import test from "../models/test/test.model";
import checkIsInRole from "./../service/utils";
import { role } from "./../models/users/users.model";
let router = Router();
const secretKey = process.env.secretKey;

router.get(
  "/getAllTest",
  passport.authenticate("jwt", { session: false }),
  checkIsInRole(role.educator, role.admin, role.user),
  async (req: Request, res: Response) => {
    test
      .find()
      .then((tests) => {
        let result: any = {};
        for (let i = 0; i < tests.length; i++) {
          let _id = tests[i]._id;
          result[_id] = tests[i];
        }
        res.send(result).status(200);
      })
      .catch((err) => {
        res.send(err).status(500);
      });
  }
);

router.post(
  "/createTest",
  passport.authenticate("jwt", { session: false }),
  checkIsInRole(role.educator, role.admin),
  async (req: Request, res: Response) => {
    const _id = req.body._id;
    const testName = req.body.testName;
    const testObject = {
      _id: _id,
      testData: {
        testName: testName,
        questions: {},
      },
    };

    new test(testObject)
      .save()
      .then((result) => {
        let sendData: any = { testData: {}, message: "success" };
        sendData["testData"][_id] = result;
        res.send(sendData);
      })
      .catch((e) => {
        res.send(e).status(500);
      });
  }
);

router.post(
  "/saveTest",
  passport.authenticate("jwt", { session: false }),
  checkIsInRole(role.educator, role.admin),
  async (req: Request, res: Response) => {
    const _id = req.body._id;
    const testName = req.body.testName;
    let questions = req.body.questions;
    const testObject = {
      _id: _id,
      testData: {
        testName: testName,
        questions: questions,
      },
    };
    test
      .findOneAndUpdate({ _id: _id }, testObject)
      .then((result) => {
        res.send({ message: "success" }).status(200);
      })
      .catch((err) => {
        res.send(err).status(500);
      });
  }
);

router.post(
  "/deleteTest",
  passport.authenticate("jwt", { session: false }),
  checkIsInRole(role.educator, role.admin),
  async (req: Request, res: Response) => {
    const _id = req.body._id;
    test
      .findByIdAndDelete({ _id })
      .then((result) => {
        res.send({ message: "success" }).status(200);
      })
      .catch((err) => {
        res.send(err).status(500);
      });
  }
);
export default router;
