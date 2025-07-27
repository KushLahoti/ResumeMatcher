import express from "express";
import { login, logout, signUpUser } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const userRouter = express.Router();

userRouter.post("/signup", signUpUser);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.get("/me", protectRoute, (req, res) => {
  return res.send({ user: req.user });
});

export default userRouter;
