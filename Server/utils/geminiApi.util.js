import axios from 'axios';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
dotenv.config();
const key = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(key);

export const getAIResumeSuggestions = async(cloudinaryURL,jobDescription) =>{
    try{
       const model = genAI.getGenerativeModel({model:"gemini-1.5-flash"});
     const prompt = `You are an expert career assistant.

Based on the following job description and the resume provided at the given URL, analyze their similarity in terms of skills, degree, project work, and experience. Identify gaps or mismatches, and then generate a list of clear, actionable bullet-point suggestions that would help improve the candidate’s chances of matching the job description.

Each suggestion should be concise, insightful, and aimed at improving the relevance of the resume to the job. Focus on enhancing areas like technical skills, academic qualifications, project relevance, and work experience.

Important:
- Present only the list of suggestions.
- Each suggestion should start with a dash.
- Do not include any introduction or conclusion.

Job Description:
${jobDescription}

Resume Link:
${cloudinaryURL}

Generate suggestions like:
- Add specific technical skills from the JD such as 'React.js' or 'Azure Data Factory'.
- Include the full academic degree title to match the job's required qualifications.
- Highlight relevant project experience using keywords from the JD.`;

const result = await model.generateContent(prompt);

const response = result.response;

const text = response.text();

const suggestions = text.split('\n').map(line=>line.trim()).filter(line=>line.startsWith('-'));
return suggestions;
    }
    catch(error){
       console.error('Error in generating AI suggestions:', error);
       return []; 
    }

}