import { Request, Response, Router } from "express";
import passport from "passport";
import checkIsInRole from "./../service/utils";
import { role } from "./../models/users/users.model";
import ClassFunctions from "./../service/class/ClassFunctions";
let router = Router();
router.use(
  passport.authenticate("jwt", { session: false }),
  checkIsInRole(role.admin)
);
router.get("/getAllClasses", (req, res) => {
  new ClassFunctions()
    .getClasses()
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});
router.post("/deleteClass", (req, res) => {
  const classId = req.body.classId;
  new ClassFunctions()
    .deleteClass(classId)
    .then((result) => {
      res.send({ message: "success" });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});
router.post("/createClass", (req, res) => {
  const className = req.body.className;
  new ClassFunctions()
    .createClass(className)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.status(409).send(error);
    });
});

export default router;
