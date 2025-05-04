import { Router } from "express";
import { userCreate } from "../controllers/user/userCreate";
import { userGet, userGetMe } from "../controllers/user/userGet";
import { userLogin } from "../controllers/user/userLogin";
import { verifyOtp } from "../controllers/user/verifyOtp";
import { generateOtp } from "../controllers/user/generateOtp";
import { authenticateJWT } from "../middleware/auth";

const router = Router();

router.get("/", userGet);
router.get("/me", authenticateJWT, userGetMe);
router.post("/register", userCreate);
router.post("/login", userLogin);
router.post("/generate-otp", generateOtp);

export default router;
