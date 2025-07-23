import mongoose from "mongoose";

const JDMatchResultSchema = new mongoose.Schema({
    HRId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    JDId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobDescription',
        required: true
    },
    MatchedResumes: [
        {
            resumeId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'StudentResume',
                required: true
            },
            score: {
                type: Number,
                required: true
            }
        }
    ]
}, {
    timestamps: true
});

const JDMatchResult = mongoose.model('JDMatchResult', JDMatchResultSchema);

export default JDMatchResult;