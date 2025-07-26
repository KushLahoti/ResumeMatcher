
import JobDescription from "../models/JobDescription.model";
import StudentResume from "../models/StudentResume.model";
import JDMatchResult from "../models/JDMatchResult.model"

const dummyScore = (jdText,resumeUrl) =>{
   return Math.floor(Math.random()*101); 
}

export const getAllHrMatchResults = async (req,res)=>{
    try{
       const HRId = req.user?._id
  if(!HRId){
     return res.status(401).json({success:false,message:'Please Login First!'});
  }
  const results = await JDMatchResult.find({HRId}).sort({createdAt : -1});
  res.status(200).json({
    success :true,message:'All Match Results fetched',data:results
  });
    }catch(error){
      console.error("Error in getAllHrMatchResults", error);
      res.status(500).json({
        success:false,
        message : "Interval sever error"
      })
    }
}

export const getOneHrMatchResults = async (req,res)=>{
    try{
       const HRId = req.user?._id
  if(!HRId){
     return res.status(401).json({success:false,message:'Please Login First!'});
  }
       const {id} = req.params
    if(!id){
        return res.status(401).json({success:false,message:'No such entry found'})
    }
    const result = await JDMatchResult.findById(id);
    return res.status(201).json({success:false,message:'Successfully fetched',data:result})
    }catch(error){
       console.error("Error in getOneHrMatchResults", error);
      res.status(500).json({
        success:false,
        message : "Interval sever error",
      })
    }
}

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

