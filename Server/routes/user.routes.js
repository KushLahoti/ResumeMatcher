import express from 'express'
import { login, logout, signUpUser } from '../controllers/auth.controller.js';
const userRouter = express.Router();
userRouter.post("/signup", signUpUser)
userRouter.post("/login",login)
userRouter.post("/logout", logout)

export default userRouter
