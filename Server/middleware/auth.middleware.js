import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import RefreshToken from "../models/refreshToken.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = req.cookies;
    let user, token, decoded;
    if (!accessToken && !refreshToken) {
      return res
        .status(401)
        .json({ success: false, messaage: "Unauthorized Access 1" });
    }
    if (refreshToken) {
      decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);
    }
    if (decoded) {
      user = await User.findById(decoded.userId);
    }
    if (user) {
      token = await RefreshToken.findOne({ userId: decoded.userId });
    }
    if (!decoded || !user || !token || token.refreshToken !== refreshToken) {
      res.clearCookie("refreshToken");
      res.clearCookie("accessToken");
      return res
        .status(401)
        .json({ success: false, messaage: "Unauthorized Access 2" });
    }
    if (!accessToken) {
      const newAccessToken = jwt.sign(
        { userId: decoded.userId, role: decoded.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: parseInt(process.env.MAX_AGE_ACCESS_TOKEN) }
      );
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: parseInt(process.env.MAX_AGE_ACCESS_TOKEN),
      });
    }
    req.user = user;
    return next();
  } catch (error) {
    console.log("Error from ProtectRouteMiddleware", error);
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error" });
  }
};
