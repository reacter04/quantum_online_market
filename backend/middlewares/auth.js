import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "./catchAsyncErrors.js";
import User from "../modals/user.js";
import jwt from "jsonwebtoken";

//Verificam daca utilizatul este autentificat sau nu
export const isAuthentificatedUser = catchAsyncErrors(
  async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
      return next(new ErrorHandler("Login first to acces this resource", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    next();
  }
);

//Administrarea rolurilor utilizatorilor (creeaza produs sau obtine lista tuturor userilor doar adminul)
export const authoriseRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role (${req.user.role}) is not allowed to acces this resource`,
          403
        )
      );
    }
    next();
  };
};
