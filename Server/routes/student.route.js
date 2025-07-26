import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js"
import {
  getAllHistory,
  getHistoryById,
  deleteHistory,
  handleUploadResumeAndDescription,
} from "../controllers/student.controller.js";

const router = express.Router();

router.get("/history", protectRoute, getAllHistory);
router.get("/history/:id", protectRoute, getHistoryById);
router.delete("history/:id", protectRoute, deleteHistory);
router.post("/upload", protectRoute, upload, handleUploadResumeAndDescription);

export default router
