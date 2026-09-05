import Router from "express";
import { forgetPasswordController, resetPasswordController } from "../controllers/password.controllers.js";

const router = Router();

router.post('/forget-password', forgetPasswordController);

router.post('/reset-password', resetPasswordController);

export default router;