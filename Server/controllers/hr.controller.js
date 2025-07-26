import express from "express";
import JDMatchResult from "../models/JDMatchResult.model.js";
import JobDescription from "../models/JobDescription.model";
import StudentResume from "../models/StudentResume.model";
import JDMatchResult from "../models/JDMatchResult.model"
import axios from 'axios'


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


export const uploadAndMatchResumesToJD = async (req,res)=>{
  try{
    const HRId = req.user?._id;
  if(!HRId){
    return res.status(401).json({success:false,message:"Please Login first!"})
  }
    const jobDescription = req.body.description;

  if(!jobDescription){
    return res.status(404).json({
        success:false,
        message:"No Job Description Found"
    })
  }
   const createdJD = await JobDescription.create({
     HRId,
     description:jobDescription
   });

 if(!createdJD){
    return res.status(500).json({success:false, message:'Failed to create the JD in the database'});
 }
    
  const allStudentResumes = await StudentResume.find();
  const resumeUrls = allStudentResumes.map(r=>(r.Resume));

  const response = await axios.post("http://127.0.0.1:5000/get_score", {
      job_description: jobDescription,
      resume_url: resumeUrls
    });

    const scores = response.data?.score;

    const {
      degree_score = [],
      experience_score =[],
      project_score=[],
      skill_score=[],
      result=[]
    } = scores;

    const tempMatches = allStudentResumes.map((resume,index)=>({
      HRId,
      JDId:createdJD._id,
      reumeId:resume._id,
      resumeUrl: resume.Resume,
      degree_score: degree_score[index] || 0,
      experience_score: experience_score[index] || 0,
      project_score: project_score[index] || 0,
      skill_score: skill_score[index] || 0,
      result: result[index] || 0
    }));

   const topMatches = tempMatches.sort((a, b) => b.result - a.result).slice(0, 5);

  const matchResult = new JDMatchResult({
     HRId,
     JDId : createdJD._id,
     MatchedResumes : topMatches
  })

  await matchResult.save();

  res.json({success : true,message : "5 resumes Matched", data:matchResult })
  }catch(error){
    console.error("Error:",error);
    res.status(500).json({success:false,message : 'Server Error'});
  }
}

