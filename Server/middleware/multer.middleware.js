import multer from "multer";
import path from "path";

// This stores files in memory (RAM)
const storage = multer.memoryStorage();

// Optional: file filter to accept only PDFs
const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".pdf") {
        return cb(new Error("Only PDF files are allowed"), false);
    }
    cb(null, true);
};

// You will now access the file using req.file.buffer
export const upload = multer({ storage, fileFilter }).single("resume");
