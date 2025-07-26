import StudentHistory from "../models/StudentHistory.model.js";
import StudentResume from "../models/StudentResume.model.js";
import { uploadResumeOnCloudinary } from "../utils/cloudinary.util.js";
import axios from "axios";

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

// Upload Resume and Job Description
export const handleUploadResumeAndDescription = async (req, res) => {
    try {
        const studentId = req.user?._id;
        const localResumePath = req.file?.path;
        const JobDescription = req.body.JobDescription;

        if (!studentId) {
            return res.status(400).json({ success: false, message: "You need to login first" });
        }

        if (!localResumePath || !JobDescription) {
            return res.status(400).json({ success: false, message: "Missing Required Fields" });
        }

        const fileOnCloudinary = await uploadResumeOnCloudinary(localResumePath);

        if (!fileOnCloudinary) {
            return res.status(500).json({ success: false, message: "Failed to upload on cloudinary" });
        }

        const resumeUrl = fileOnCloudinary.secure_url;

        //Call the AI model API
        const aiResponse = await axios.post("http://127.0.0.1:5000/get_score", {
            resume_url: [resumeUrl],
            job_description: JobDescription
        })

        const savedResume = await StudentResume.create({
            StudentId: studentId,
            Resume: fileOnCloudinary.secure_url
        })

        const score = {
            degree_score: aiResponse.data.score.degree_score[0],
            experience_score: aiResponse.data.score.experience_score[0],
            project_score: aiResponse.data.score.project_score[0],
            skill_score: aiResponse.data.score.skill_score[0],
            result: aiResponse.data.score.result[0],
        };

        await StudentHistory.create({
            user: studentId,
            job_description: JobDescription,
            resume: savedResume._id,
            score
        })

        return res.status(201).json({
            success: true,
            message: "Resume and Job Description uploaded",
            data: score,
        });

    } catch (error) {
        console.log("Error from handleUploadResumeAndDescription", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}