import mongoose from "mongoose";

const schema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    job_description: {
      type: String,
      required: true,
    },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentResume",
      required: true,
    },
    score: {
      degree_score: {
        type: Number,
        default: 0,
      },
      experience_score: {
        type: Number,
        default: 0,
      },
      project_score: {
        type: Number,
        default: 0,
      },
      result: {
        type: Number,
        default: 0,
      },
      skill_score: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true }
);

const StudentHistory = mongoose.model("StudentHistory", schema);

export default StudentHistory;
