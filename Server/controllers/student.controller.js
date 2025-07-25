import express from "express";
import StudentHistory from "../models/StudentHistory.model.js";

export const getAllHistory = async (req, res) => {
  try {
    const history = await StudentHistory.find({ user: req.user._id }).populate(
      "resume"
    );
    res.status(200).json(history);
  } catch (error) {
    console.error("error in getAllHistory:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getHistoryById = async (req, res) => {
  try {
    const history = await StudentHistory.findById(req.params.id).populate(
      "resume"
    );
    if (!history) {
      return res.status(404).json({ message: "History not found" });
    }
    res.status(200).json(history);
  } catch (error) {
    console.error("error in getHistoryById:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteHistory = async (req, res) => {
  try {
    const history = await StudentHistory.findByIdAndDelete(req.params.id);
    if (!history) {
      return res.status(404).json({ message: "History not found" });
    }
    res.status(200).json({ message: "History deleted successfully" });
  } catch (error) {
    console.error("error in deleteHistory:", error);
    res.status(500).json({ message: "Server error" });
  }
};
