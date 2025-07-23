import mongoose from "mongoose";

const JobDescriptionSchema = new mongoose.Schema({
    HRId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const JobDescription = mongoose.model('JobDescription', JobDescriptionSchema);

export default JobDescription;