import { Router } from "express";
import { verifyController, verifyErrorController } from "../controllers/verify.controllers.js";


const router = Router();


//register router
router.get("/verify-email", verifyController);
router.get("/verify-error", verifyErrorController);

export default router;