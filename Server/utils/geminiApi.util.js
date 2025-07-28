import axios from 'axios';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
dotenv.config();
const key = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(key);

export const getAIResumeSuggestions = async (cloudinaryURL, jobDescription) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `
You are a resume optimization assistant for a job-matching platform.

You are given:
- A *resume URL* (PDF)
- A *job description (JD)* as plain text
- Four category scores (Skill, Degree, Experience, Project)

You must generate a *flat array of actionable resume improvement suggestions* that help increase the sentence similarity between the resume and JD in each category.

🧠 Scoring Logic:
The scores are derived by:
- Extracting relevant sentences from resume and JD based on defining keywords
- Calculating sentence similarity via sentence-transformers
- Final Score = 0.5 * Skill Score + 0.1 * Degree Score + 0.2 * Experience Score + 0.2 * Project Score

🎯 Your Goal:
Maximize the similarity for each category by:
- Suggesting new or rephrased resume sentences using JD-style keywords and phrasing
- Ensuring suggestions match how job descriptions are worded for better transformer alignment
- Covering all 4 categories and focusing on semantic similarity

📤 Output Format:
Return a single array of improvement suggestions. Each item should be a sentence that can be added or revised in the resume.

Example output:
[
  "Add a sentence like: 'Proficient in the MERN stack: MongoDB, Express.js, React.js, and Node.js.'",
  "Mention RESTful API development and SQL database experience under Skills.",
  "Reword degree as: 'Bachelor of Technology (B.Tech) in Computer Science and Engineering with CGPA 9.06.'",
  "Include: 'Integrated Stripe payment gateway into an e-commerce platform using Node.js backend.'"
]

If the resume is not readable or the text cannot be extracted, return an empty array.

Inputs:
Resume URL: ${cloudinaryURL}
Job Description: ${jobDescription}
`;

        const result = await model.generateContent(prompt);

        const response = result.response;

        let text = response.text();

        text = text.replace(/```json|```/g, '').trim();

        let suggestions = [];
        try {
            suggestions = JSON.parse(text);  // Now this should work safely
        } catch (error) {
            console.error("Failed to parse suggestions JSON:", error);
            suggestions = [];
        }

        return suggestions;
    }
    catch (error) {
        console.error('Error in generating AI suggestions:', error);
        return [];
    }

}