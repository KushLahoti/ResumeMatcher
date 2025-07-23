import mongoose, { mongo } from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
    refreshToken: {
        type: String,
        unique: true,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const RefreshToken = mongoose.model('RefrestToken', refreshTokenSchema);

export default RefreshToken;