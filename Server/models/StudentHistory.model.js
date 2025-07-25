import mongoose from "mongoose";

const schema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    job_description: {
      type: string,
      required: true,
    },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentResume",
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const StudentHistory = mongoose.model("StudentHistory", schema);

export default StudentHistory;
