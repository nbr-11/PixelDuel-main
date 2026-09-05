import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { deleteUserController, getUserController } from "../controllers/user.controllers.js";


const router = Router();

router.get("/", authMiddleware, getUserController);
router.delete("/", authMiddleware, deleteUserController);


export default router;