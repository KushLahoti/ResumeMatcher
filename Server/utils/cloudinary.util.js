import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import "dotenv/config";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadResumeOnCloudinary = async (localResumeFilePath) => {
  try {
    if (!localResumeFilePath) {
      console.log("Not a valid local path");
      return null;
    }
    const response = await cloudinary.uploader.upload(localResumeFilePath, {
      resource_type: "raw",
    });

    fs.unlinkSync(localResumeFilePath);
    return response;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    fs.unlinkSync(localResumeFilePath); //Remove the locally saved temporary file as the upload operation is failed
    return null;
  }
};

export default cloudinary;
