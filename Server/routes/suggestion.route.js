import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getSuggestionByHistoryId } from "../controllers/suggestion.controller.js";

const router = express.Router();

router.get("/:historyid", protectRoute, getSuggestionByHistoryId);

export default router;
