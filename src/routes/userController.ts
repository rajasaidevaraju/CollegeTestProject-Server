import { Request, Response, Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validateLoginInput } from "./../service/validation/login";
import { validateRegisterInput } from "./../service/validation/register";
import { validateEmailInput } from "./../service/validation/email";
import UserFunctions from "./../service/user/UserFunctions";
import isEmpty from "is-empty";
import User from "../models/users/users.model";
import {
  LoginErrorConfig,
  RegisterErrorConfig,
  EmailErrorConfig,
} from "./../service/validation/ErrorConfig";
let router = Router();
const secretKey = process.env.secretKey;
router.post("/register", async (req: Request, res: Response) => {
  // Form validation
  const errors: RegisterErrorConfig = validateRegisterInput(req.body);
  if (!isEmpty(errors)) {
    return res.status(400).json(errors);
  }
  new UserFunctions()
    .registerUser(req.body)
    .then((result) => {
      res.send({ success: true });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.get("/forgotPassword", function (req, res) {
  const errors: EmailErrorConfig = validateEmailInput(req.query);
  if (!isEmpty(errors)) {
    return res.status(400).json(errors);
  }
  const email: string = req.query.email!.toString();
  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(404).json({ email: "Email not found" });
    }
    res.send({ success: true });
  });
});

router.get("/verifyCode", (req, res) => {
  new UserFunctions()
    .verifyCodeWithEmail(
      req.query.email!.toString(),
      req.query.code!.toString()
    )
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      let status = 500;
      if ("message" in error) {
        status = 400;
      }
      res.status(status).send(error);
    });
});
router.post("/sendVerificationEmail", (req, res) => {
  new UserFunctions()
    .createCodeForAuthentication(req.body.email)
    .then((result: any) => {
      res.send({
        message: "Code Sent to email " + req.body.email + " successfully ",
      });
    })
    .catch((error) => {
      let status = 500;
      if ("message" in error) {
        status = 400;
      }
      res.status(status).send(error);
    });
});
router.post("/login", (req, res) => {
  const errors: LoginErrorConfig = validateLoginInput(req.body);
  if (!isEmpty(errors)) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;
  new UserFunctions()
    .verifyUserWithEmailAndPassword(email, password)
    .then((result) => {
      res.json({ result });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

export default router;
