import mongoose from "mongoose";

const studentResumeSchema = new mongoose.Schema({
    StudentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    Resume: {
        type: String,
        reuired: true
    }
}, {
    timestamps: true
});

const StudentResume = mongoose.model('StudentResume', studentResumeSchema);

export default StudentResume;