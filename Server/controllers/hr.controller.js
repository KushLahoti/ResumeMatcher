import express from "express";
import JDMatchResult from "../models/JDMatchResult.model.js";
import JobDescription from "../models/JobDescription.model.js";
import StudentResume from "../models/StudentResume.model.js";
import axios from "axios";

export const getAllHistory = async (req, res) => {
  try {
    const history = await JDMatchResult.find({ HRId: req.user._id })
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
      .populate("JDId").populate({
        path: "MatchedResumes.resumeId",
        populate: {
          path: "StudentId",
          model: "User", // Make sure this matches your User model
        },
      });
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

export const uploadAndMatchResumesToJD = async (req, res) => {
  try {
    const HRId = req.user?._id;
    if (!HRId) {
      return res.status(401).json({ success: false, message: "Please Login first!" });
    }

    const jobDescription = req.body.description;
    if (!jobDescription) {
      return res.status(404).json({ success: false, message: "No Job Description Found" });
    }

    const createdJD = await JobDescription.create({ HRId, description: jobDescription });
    if (!createdJD) {
      return res.status(500).json({ success: false, message: "Failed to create the JD in the database" });
    }

    const allStudentResumes = await StudentResume.find();
    const resumeUrls = allStudentResumes.map((r) => r.Resume);
    const BATCH_SIZE = 5;

    // Scores arrays
    let degree_score = [];
    let experience_score = [];
    let project_score = [];
    let skill_score = [];
    let result = [];

    // ⏳ Process in batches
    for (let i = 0; i < resumeUrls.length; i += BATCH_SIZE) {
      const batchUrls = resumeUrls.slice(i, i + BATCH_SIZE);

      const response = await axios.post(
        `${process.env.PYTHON_SERVER_URL}/get_score`,
        {
          job_description: jobDescription,
          resume_url: batchUrls,
        }
      );

      const scores = response.data?.score || {};

      degree_score.push(...(scores.degree_score || []));
      experience_score.push(...(scores.experience_score || []));
      project_score.push(...(scores.project_score || []));
      skill_score.push(...(scores.skill_score || []));
      result.push(...(scores.result || []));
    }

    // 🧠 Combine scores with resumes
    const tempMatches = allStudentResumes.map((resume, index) => ({
      resumeId: resume._id,
      score: {
        degree_score: degree_score[index] || 0,
        experience_score: experience_score[index] || 0,
        project_score: project_score[index] || 0,
        skill_score: skill_score[index] || 0,
        result: result[index] || 0,
      },
    }));

    // 🔝 Sort and select top 5
    const topMatches = tempMatches
      .sort((a, b) => b.score.result - a.score.result)
      .slice(0, 5);

    const matchResult = new JDMatchResult({
      HRId,
      JDId: createdJD._id,
      MatchedResumes: topMatches,
    });

    await matchResult.save();
    const finalResult = await JDMatchResult.findById(matchResult._id)
      .populate("JDId")
      .populate({
        path: "MatchedResumes.resumeId",
        populate: {
          path: "StudentId",
          model: "User", // Make sure this matches your User model
        },
      });


    res.json({
      success: true,
      message: "5 resumes matched",
      data: finalResult,
    });
  } catch (error) {
    console.error("error in uploadAndMatchResumesToJD:", error);
    res.status(500).json({ message: "Server error" });
  }
};

