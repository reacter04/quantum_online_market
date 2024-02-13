import express from "express";
import {
  allUsers,
  deleteUser,
  forgotPassword,
  getUserDetails,
  getUserProfile,
  loginUser,
  logout,
  registerUser,
  resetPassword,
  updatePassword,
  updateProfile,
  updateUser,
} from "../controllers/authControllers.js";

const router = express.Router();

import { authoriseRoles, isAuthentificatedUser } from "../middlewares/auth.js";

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);

router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

router.route("/me").get(isAuthentificatedUser, getUserProfile);
router.route("/password/update").put(isAuthentificatedUser, updatePassword);
router.route("/me/update").put(isAuthentificatedUser, updateProfile);

router
  .route("/admin/users")
  .get(isAuthentificatedUser, authoriseRoles("admin"), allUsers);
router
  .route("/admin/users/:id")
  .get(isAuthentificatedUser, authoriseRoles("admin"), getUserDetails).put(isAuthentificatedUser, authoriseRoles("admin"), updateUser).delete(isAuthentificatedUser, authoriseRoles("admin"), deleteUser);

export default router;
