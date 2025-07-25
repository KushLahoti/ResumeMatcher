import express from "express";
import { upload } from "../middleware/multer.middleware.js";
import { getStudentAllMatchResults, getStudentSingleMatchResult, handleUploadResumeAndDescription } from "../controllers/student.controller.js";

const studentRouter = express.Router();

//upload form mai input field ka name resume hoga
studentRouter.post("/upload", upload, handleUploadResumeAndDescription);
studentRouter.get("/getMatchResults", getStudentAllMatchResults);
studentRouter.get("/getMatchResults/:id", getStudentSingleMatchResult);

export default studentRouter;