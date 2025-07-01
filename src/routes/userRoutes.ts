import { Router } from "express";
import { userCreate } from "../controllers/user/userCreate";
import { userLogin } from "../controllers/user/userLogin";
import { userGet, userGetMe } from "../controllers/user/userGet";
import { authenticateJWT } from "../middleware/auth";
import { userLogout } from "../controllers/user/userLogout";

const router = Router();

router.get("/", userGet);
router.get("/me", authenticateJWT, userGetMe);

router.post("/register", userCreate);
router.post("/login", userLogin);
router.post("/logout", authenticateJWT, userLogout);

export default router;
