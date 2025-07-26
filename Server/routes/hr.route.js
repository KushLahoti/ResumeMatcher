import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getAllHistory,
  getHistoryById,
  deleteHistory,
} from "../controllers/student.controller.js";

const router = express.Router();

router.get("/history", protectRoute, getAllHistory);
router.get("/history/:id", protectRoute, getHistoryById);
router.delete("history/:id", protectRoute, deleteHistory);
