import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log('Database Connectd'))
        await mongoose.connect(`${process.env.MONGODB_URI}/resumematcher`)
    } catch (error) {
        console.error(error.meassage)
    }
}

export default connectDB;