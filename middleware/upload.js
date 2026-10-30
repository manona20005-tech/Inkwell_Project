
import multer from "multer";
import { randomUUID } from "node:crypto";
import path from "node:path";

const storage = multer.diskStorage({
  destination: "uploads/",

  filename: (req, file, cb) => {
    cb(null, randomUUID() + path.extname(file.originalname).toLowerCase());
  },
});
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid image type"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
