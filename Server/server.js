import express from "express"
import cors from "cors"
import 'dotenv/config'
import connectDB from "./configs/db.configs.js";
import userRouter from "./routes/user.routes.js";
import studentRouter from "./routes/student.route.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT;

await connectDB();

app.use(express.json())
app.use(cookieParser());
app.use(cors())

app.get('/', (req, res) => {
    res.send('Server is Live')
})

app.use('/api/user', userRouter);
app.use('/api/student', studentRouter);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})