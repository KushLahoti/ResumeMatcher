import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getAllHistory,
  getHistoryById,
  deleteHistory,
  uploadAndMatchResumesToJD

} from "../controllers/student.controller.js";

const router = express.Router();

router.get("/history", protectRoute, getAllHistory);
router.get("/history/:id", protectRoute, getHistoryById);
router.delete("history/:id", protectRoute, deleteHistory);
router.post('/upload',  protectRoute, uploadAndMatchResumesToJD);