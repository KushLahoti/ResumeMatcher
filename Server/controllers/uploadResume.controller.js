import StudentResume from "../models/StudentResume.model.js";
import { uploadResumeOnCloudinary } from "../utils/cloudinary.util.js";


export const handleUploadResume = async (req, res) => {
    try {
        const localResumePath = req.file?.path;

        if (!localResumePath) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const fileOnCloudinary = await uploadResumeOnCloudinary(localResumePath);

        if (!fileOnCloudinary) {
            return res.status(500).send({ success: false, message: "Failed to upload on cloudinary" });
        }

        const studentId = req.user?._id;

        if (!studentId) {
            return res.status(400).json({ success: false, message: "Student not logged in" });
        }

        const savedResume = await StudentResume.create({
            StudentId: studentId,
            Resume: fileOnCloudinary.secure_url
        })

        return res.status(201).json({
            success: true,
            message: "Resume uploaded",
            data: savedResume,
        });

    } catch (error) {
        console.log("Error from uploadResume Controller", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}