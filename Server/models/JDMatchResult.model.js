import mongoose from "mongoose";

const JDMatchResultSchema = new mongoose.Schema(
  {
    HRId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    JDId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobDescription",
      required: true,
    },
    MatchedResumes: [
      {
        resumeId: {
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
    ],
  },
  {
    timestamps: true,
  }
);

const JDMatchResult = mongoose.model("JDMatchResult", JDMatchResultSchema);

export default JDMatchResult;
