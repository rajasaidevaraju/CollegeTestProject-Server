import User from "../../models/users/users.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUsers } from "./../../models/users/users.model";
export default class UserFunctions {
  secretKey: string = process.env.secretKey || "";

  verifyUserWithEmail(email: string, showErr: boolean) {
    return new Promise((resolve, reject) => {
      User.findOne({ email }).then((user) => {
        if (!user && showErr) {
          reject({ email: "Email not found" });
        }
        resolve(user);
      });
    });
  }

  registerUser(body: any) {
    return new Promise((resolve, reject) => {
      console.log(body);
      this.verifyUserWithEmail(body.email, false)
        .then((user) => {
          if (user) {
            reject({ email: "Email already exists" });
          } else {
            const newUser = new User({
              name: body.name,
              email: body.email,
              password: body.password,
              isVerified: false,
            });
            // Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser
                  .save()
                  .then((user) => resolve(user))
                  .catch((err) => reject(err));
              });
            });
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  verifyUserWithEmailAndPassword(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.verifyUserWithEmail(email, true)
        .then((result: any) => {
          bcrypt.compare(password, result.password).then((isMatch) => {
            if (isMatch) {
              if (!result.isVerified) {
                reject({ isVerified: false });
                return;
              }
              const payload = {
                id: result.id,
                name: result.name,
                role: result.role,
                isVerified: result.isVerified,
              };

              jwt.sign(
                payload,
                this.secretKey,
                {
                  expiresIn: 31556926, // 1 year in seconds
                },
                (err, token) => {
                  resolve({
                    token: "Bearer " + token,
                  });
                }
              );
            } else {
              return reject({ password: "Password incorrect" });
            }
          });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
