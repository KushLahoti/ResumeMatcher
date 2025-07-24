import multer from "multer";
import path from "path";
import fs from "fs";

//form mai attributes dena hai read from multer docs
//req.body mai text fields of form
//req.file mai file hoti hai

const tempDir = "temporaryResume";

if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tempDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".pdf") {
        return cb(new Error("Only PDF files are allowed"), false);
    }
    cb(null, true);
}

export const upload = multer({ storage, fileFilter });