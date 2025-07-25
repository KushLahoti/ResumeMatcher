import express from "express";
import { upload } from "../middleware/multer.middleware.js";
import { handleUploadResume } from "../controllers/uploadResume.controller.js";

const uploadResumeRouter = express.Router();

//upload form mai input field ka name resume hoga
uploadResumeRouter.post("/uploadResume", upload.single("resume"), handleUploadResume);

export default uploadResumeRouter;