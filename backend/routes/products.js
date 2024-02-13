import express from "express";
import {
  createProductReview,
  deleteProduct,
  deleteReview,
  getProductDetails,
  getProductReviews,
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
router
  .route("/products/:id")
  .put(isAuthentificatedUser, authoriseRoles("admin"), updateProduct);
router
  .route("/products/:id")
  .delete(isAuthentificatedUser, authoriseRoles("admin"), deleteProduct); //aici trebuie sa verific daca functioneaza totul bine

router
  .route("/reviews")
  .get(isAuthentificatedUser, getProductReviews)
  .put(isAuthentificatedUser, createProductReview);

router
  .route("/admin/reviews")
  .delete(isAuthentificatedUser, authoriseRoles("admin"), deleteReview);
export default router;
