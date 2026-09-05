import Router from "express";
import { createDuelController, deleteDuelController, getAllDuelController, getUniqueController, updateDuelController } from "../controllers/duel.controllers.js";
import { upload } from "../config/multerConfig.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { createDuelItem } from "../controllers/duelItems.controller.js";


const router = Router();

router.post("/", authMiddleware, upload.single('image'), createDuelController);
router.get("/", authMiddleware, upload.none(), getAllDuelController);
router.get("/:id", upload.none(), getUniqueController);
router.put("/:id", authMiddleware, upload.single("image"), updateDuelController);
router.delete("/:id", authMiddleware, upload.none(), deleteDuelController);


router.post("/items", authMiddleware, upload.array("images[]", 2), createDuelItem);
export default router;