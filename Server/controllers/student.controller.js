import StudentResume from "../models/StudentResume.model.js";
import { uploadResumeOnCloudinary } from "../utils/cloudinary.util.js";

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



        const savedResume = await StudentResume.create({
            StudentId: studentId,
            Resume: fileOnCloudinary.secure_url
        })



        return res.status(201).json({
            success: true,
            message: "Resume and Job Description uploaded",
            data: savedResume,
        });

    } catch (error) {
        console.log("Error from handleUploadResumeAndDescription", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}

//get all the student previous uploaded resumes and their corresponding scores for corresponding JD
export const getStudentAllMatchResults = async (req, res) => {
    try {
        const studentId = req.user?._id;

        if (!studentId) {
            return res.status(401).json({ success: false, message: "Please Login First!" });
        }

        const results = await StudentMatchResult.find({ StudentId: studentId }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Match Results Fetched Successfully",
            data: results
        });

    } catch (error) {
        console.error("Error in getStudentMatchResults:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

//get a particular resume result for the corresponding job description
export const getStudentSingleMatchResult = async (req, res) => {
    try {
        const studentId = req.user?._id;
        const { id } = req.params;

        if (!studentId) {
            return res.status(401).json({ success: false, message: "Please Login First!" });
        }

        if (!id) {
            return res.status(400).json({ success: false, message: "Invalid request" });
        }

        const result = await StudentMatchResult.findOne({ _id: id, StudentId: studentId });

        if (!result) {
            return res.status(404).json({ success: false, message: "Result not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Result fetched successfully",
            data: result,
        });

    } catch (error) {
        console.error("Error in getSingleMatchResult:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}