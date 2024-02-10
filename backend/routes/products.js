import express from "express";
import {
  deleteProduct,
  getProductDetails,
  getProducts,
  newProduct,
  updateProduct,
} from "../controllers/productControllers.js";
import { authoriseRoles, isAuthentificatedUser } from "../middlewares/auth.js";

const router = express.Router();

router.route("/products").get(getProducts);
router
  .route("/admin/products")
  .post(isAuthentificatedUser, authoriseRoles("admin"), newProduct);
router.route("/products/:id").get(getProductDetails);
router.route("/admin/products/:id").put(isAuthentificatedUser, authoriseRoles("admin"), updateProduct);
router.route("/admin/products/:id").delete(isAuthentificatedUser, authoriseRoles("admin"), deleteProduct);

export default router;
