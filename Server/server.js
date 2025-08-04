import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// Import routes
import studentRoutes from "./routes/student.route.js";
import hrRoutes from "./routes/hr.route.js";
import suggestionRoutes from "./routes/suggestion.route.js";
import userRoutes from "./routes/user.routes.js";

// Load env variables
dotenv.config();

const app = express();

// ✅ CORS setup — ALLOW frontend to access backend
const allowedOrigins = [
  "https://resume-matcher-fe.vercel.app",
  "http://localhost:3000"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

app.options("*", cors()); // For preflight support

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/student", studentRoutes);
app.use("/hr", hrRoutes);
app.use("/suggestion", suggestionRoutes);
app.use("/user", userRoutes);

// Health check (optional)
app.get("/", (req, res) => {
  res.send("Backend is working!");
});

export default app;
