import { Router } from "express";
import { getAllProducts } from "../controllers/product/getProducts";
import { getProductById } from "../controllers/product/getProducts";
import {
  uploadProductImages,
  createProducts,
} from "../controllers/product/createProducts";

import { authenticateJWTAdmin } from "../middleware/isAdmin";

const router = Router();

router.get("/get", getAllProducts);
router.get("/:id", getProductById);
router.post(
  "/create",
  authenticateJWTAdmin,
  uploadProductImages,
  createProducts,
);

export default router;
