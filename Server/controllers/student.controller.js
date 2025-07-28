import StudentHistory from "../models/StudentHistory.model.js";
import StudentResume from "../models/StudentResume.model.js";
import { uploadResumeOnCloudinary } from "../utils/cloudinary.util.js";
import axios from "axios";
import { getAIResumeSuggestions } from "../utils/geminiApi.util.js";
import Suggestions from "../models/Suggestions.Model.js";
import mongoose from "mongoose";

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
  const id = req.params.id;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid or missing ID" });
  }
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
  const id = req.params.id;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid or missing ID" });
  }
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

// Upload Resume and Job Description
export const handleUploadResumeAndDescription = async (req, res) => {
  try {
    const studentId = req.user?._id;
    const localResumePath = req.file?.path;
    const JobDescription = req.body.JobDescription;

    if (!studentId) {
      return res
        .status(400)
        .json({ success: false, message: "You need to login first" });
    }

    if (!localResumePath || !JobDescription) {
      return res
        .status(400)
        .json({ success: false, message: "Missing Required Fields" });
    }

    const fileOnCloudinary = await uploadResumeOnCloudinary(localResumePath);

    if (!fileOnCloudinary) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to upload on cloudinary" });
    }

    const resumeUrl = fileOnCloudinary.secure_url;

    //Call the AI model API
    const aiResponse = await axios.post(
      `${process.env.PYTHON_SERVER_URL}/get_score`,
      {
        resume_url: [resumeUrl],
        job_description: JobDescription,
      }
    );

    const score = {
      degree_score: aiResponse.data.score.degree_score[0],
      experience_score: aiResponse.data.score.experience_score[0],
      project_score: aiResponse.data.score.project_score[0],
      skill_score: aiResponse.data.score.skill_score[0],
      result: aiResponse.data.score.result[0],
    };

    const savedResume = await StudentResume.create({
      StudentId: studentId,
      Resume: fileOnCloudinary.secure_url,
    });

    const createdHistory = await StudentHistory.create({
      user: studentId,
      job_description: JobDescription,
      resume: savedResume._id,
      score,
    });
    const suggestionsArray = await getAIResumeSuggestions(
      resumeUrl,
      JobDescription
    );

    if (!suggestionsArray) {
      return res
        .status(500)
        .json({ success: false, message: "Failed in generating suggestions" });
    }
    await Suggestions.create({
      history_id: createdHistory._id,
      suggestions: suggestionsArray,
    });

    return res.status(201).json({
      success: true,
      message: "Resume and Job Description uploaded and suggestions given",
      data: {
        score,
        suggestions: suggestionsArray,
        history_id: createdHistory._id,
      },
    });
  } catch (error) {
    console.log("Error from handleUploadResumeAndDescription", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
