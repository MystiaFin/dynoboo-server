import { Router } from "express";
import { userCreate } from "../controllers/user/userCreate";
import { userGet } from "../controllers/user/userGet";
import { userLogin } from "../controllers/user/userLogin";
import { verifyOtp } from "../controllers/user/verifyOtp";
import { generateOtp } from "../controllers/user/generateOtp";

const router = Router();

router.get("/", userGet);
router.post("/register", userCreate);
router.post("/login", userLogin);
router.post("/generate-otp", generateOtp);

export default router;
