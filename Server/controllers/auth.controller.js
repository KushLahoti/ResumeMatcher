import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import RefreshToken from "../models/refreshToken.model.js";

const max_age_access_token = parseInt(process.env.MAX_AGE_ACCESS_TOKEN);
const max_age_refresh_token = parseInt(process.env.MAX_AGE_REFRESH_TOKEN);

const createToken = (user) => {
  const payload = {
    userId: user._id,
    role: user.role,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });

  return { accessToken, refreshToken };
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: max_age_access_token,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: max_age_refresh_token,
  });
};

export const signUpUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res
      .status(400)
      .send({ success: false, message: "Enter all the fields" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .send({ success: false, message: "User Already Exist" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });
    await user.save();

    const { accessToken, refreshToken } = createToken(user);

    setCookies(res, accessToken, refreshToken);

    await RefreshToken.create({
      refreshToken,
      userId: user._id,
    });

    return res.status(201).send({
      user: user,
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error from SignUpController", error);
    res.send({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(401)
      .send({ success: false, message: "Missing credentials" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).send({ success: false, message: "Invalid email" });
    }
    const refToken = await RefreshToken.find({ userId: user._id });
    if (refToken.length > 0) {
      await RefreshToken.deleteMany({ userId: user._id });
    }
    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      res.status(401).send({ success: false, message: "Invalid password" });
    }

    const { accessToken, refreshToken } = createToken(user);
    setCookies(res, accessToken, refreshToken);

    await RefreshToken.create({
      refreshToken,
      userId: user._id,
    });

    return res.status(201).send({
      user: user,
      success: true,
      message: "Login Succesful",
    });
  } catch (error) {
    console.error("Error from LoginController", error);
    res.status(500).send({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: max_age_access_token,
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: max_age_access_token,
    });

    await RefreshToken.findOneAndDelete({ refreshToken });

    return res.status(201).send({ success: true, message: "Logged Out" });
  } catch (error) {
    console.error("Error from LogoutController", error);
    res.status(500).send({ success: false, message: error.message });
  }
};
