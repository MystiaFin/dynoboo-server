import { Router } from "express";
import { createCartItem } from "../controllers/item/createCartItem";
import { updateCartItem } from "../controllers/item/updateCartItem";
import { deleteCartItem } from "../controllers/item/deleteCartItem";

import { authenticateJWT } from "../middleware/auth";
const router = Router();

router.post("/create", authenticateJWT, createCartItem);
router.put("/update/:id", authenticateJWT, updateCartItem);
router.delete("/delete/:id", authenticateJWT, deleteCartItem);

export default router;
