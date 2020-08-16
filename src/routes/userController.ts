import { Request, Response, Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validateLoginInput } from "./../service/validation/login";
import { validateRegisterInput } from "./../service/validation/register";
import isEmpty from "is-empty";
import User from "../models/users/users.model";
import {
  LoginErrorConfig,
  RegisterErrorConfig,
} from "./../service/validation/ErrorConfig";
let router = Router();
const secretKey = process.env.secretKey;
router.post("/register", async (req: Request, res: Response) => {
  // Form validation
  const errors: RegisterErrorConfig = validateRegisterInput(req.body);
  if (!isEmpty(errors)) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });
      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

router.post("/login", (req, res) => {
  const errors: LoginErrorConfig = validateLoginInput(req.body);
  if (!isEmpty(errors)) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }

    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        const payload = {
          id: user.id,
          name: user.name,
          role: user.role,
        };

        jwt.sign(
          payload,
          secretKey!,
          {
            expiresIn: 31556926, // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

export default router;
