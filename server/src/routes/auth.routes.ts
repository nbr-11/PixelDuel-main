import { Router } from "express";
import { CheckCredentials, loginController, registerController } from "../controllers/auth.controllers.js";
import { authLimiter } from "../config/rateLimit.js";
import PasswordRouter from "./password.routes.js";


const router = Router();


router.use(authLimiter);

router.post("/register", registerController);

router.post("/login", loginController);

router.post("/check-credentials", CheckCredentials);

router.use("/", PasswordRouter)

export default router;