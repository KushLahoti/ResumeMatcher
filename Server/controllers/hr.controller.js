import express from "express";
import JDMatchResult from "../models/JDMatchResult.model.js";

export const getAllHistory = async (req, res) => {
  try {
    const history = await JDMatchResult.find({ user: req.user._id })
      .populate("MatchedResumes.resumeId")
      .populate("JDId");
    res.status(200).json(history);
  } catch (error) {
    console.error("error in hr getAllHistory:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getHistoryById = async (req, res) => {
  try {
    const history = await JDMatchResult.findById(req.params.id)
      .populate("MatchedResumes.resumeId")
      .populate("JDId");
    if (!history) {
      return res.status(404).json({ message: "History not found" });
    }
    res.status(200).json(history);
  } catch (error) {
    console.error("error in hr getHistoryById:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteHistory = async (req, res) => {
  try {
    const history = await JDMatchResult.findByIdAndDelete(req.params.id);
    if (!history) {
      return res.status(404).json({ message: "History not found" });
    }
    res.status(200).json({ message: "History deleted successfully" });
  } catch (error) {
    console.error("error in hr deleteHistory:", error);
    res.status(500).json({ message: "Server error" });
  }
};
