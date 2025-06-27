import { Router } from "express";
import { userCreate } from "@controllers/user/userCreate";
import { userLogin } from "@controllers/user/userLogin";
import { userGet, userGetMe } from "@controllers/user/userGet";
import { authenticateJWT } from "@middlewares/auth";

const router = Router();

router.get("/", userGet);
router.post("/register", userCreate);
router.post("/login", userLogin);
router.get("/me", authenticateJWT, userGetMe);

export default router;
