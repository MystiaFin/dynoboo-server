import { Router } from "express";
import { userCreate } from "../controllers/user/userCreate";
import { userGet } from "../controllers/user/userGet";
import { userLogin } from "../controllers/user/userLogin";

const router = Router();

router.get("/", userGet);
router.post("/register", userCreate);
router.post("/login", userLogin);

export default router;
