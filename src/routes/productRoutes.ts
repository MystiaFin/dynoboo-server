import { Router } from "express";
import { getAllProducts } from "../controllers/product/getProducts";
import {
  uploadProductImages,
  createProducts,
} from "../controllers/product/createProducts";

import { authenticateJWTAdmin } from "../middleware/isAdmin";

const router = Router();

router.get("/get", getAllProducts);
router.get("/get/:id", getAllProducts);
router.post(
  "/create",
  authenticateJWTAdmin,
  uploadProductImages,
  createProducts,
);

export default router;
