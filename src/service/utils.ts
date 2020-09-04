import { role } from "./../models/users/users.model";
import { Request, Response, NextFunction } from "express";
const checkIsInRole = (...roles: role[]) => (
  req: any,
  res: Response,
  next: NextFunction
) => {
  let hasRole: role | undefined;
  if (req.user) {
    const userRole = req.user.role;
    hasRole = roles.find((role) => userRole === role);
  }
  if (!hasRole) {
    return res.redirect("/Login");
  }

  return next();
};

export default checkIsInRole;
