import express from "express";
const router = express.Router();
import { authoriseRoles, isAuthentificatedUser } from "../middlewares/auth.js";
import {
  allOrders,
  deleteOrder,
  getOrderDetails,
  myOrders,
  newOrder,
  updateOrder,
} from "../controllers/orderControllers.js";

router.route("/orders/new").post(isAuthentificatedUser, newOrder);
router.route("/orders/:id").get(isAuthentificatedUser, getOrderDetails);
router.route("/me/orders").get(isAuthentificatedUser, myOrders);
router
  .route("/admin/orders")
  .get(isAuthentificatedUser, authoriseRoles("admin"), allOrders);
router
  .route("/admin/orders/:id")
  .put(isAuthentificatedUser, authoriseRoles("admin"), updateOrder)
  .delete(isAuthentificatedUser, authoriseRoles("admin"), deleteOrder);

export default router;
