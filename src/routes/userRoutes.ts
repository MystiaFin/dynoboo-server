import { Router } from "express";
import { userCreate } from "../controllers/user/userCreate";
import { userGet } from "../controllers/user/userGet";
import { userLogin } from "../controllers/user/userLogin";

const router = Router();

router.get("/users", userGet);
router.post("/user/register", userCreate);
router.post("/user/login", userLogin);

export default router;
