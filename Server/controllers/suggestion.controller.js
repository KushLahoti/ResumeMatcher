import Suggestions from "../models/Suggestions.Model.js";
import mongoose from "mongoose";

export const getSuggestionByHistoryId = async (req, res) => {
  try {
    if (
      !req.params.historyid ||
      !mongoose.Types.ObjectId.isValid(req.params.historyid)
    ) {
      return res.status(400).json({ message: "Valid History ID is required" });
    }
    const historyId = req.params.historyid;
    const suggestions = await Suggestions.findOne({ history_id: historyId });

    if (!suggestions) {
      return res.status(404).json({ message: "Suggestions not found" });
    }

    res.status(200).json(suggestions);
  } catch (error) {
    console.error("error in getSuggestionByHistoryId:", error);
    res.status(500).json({ message: "Server error" });
  }
};
