import multer, { FileFilterCallback } from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { Request } from "express";
import cloudinary from "../config/cloudinary";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, _file) => ({
    folder: "avatars",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],

    transformation: [
      { width: 500, height: 500, crop: "fill", gravity: "face" },
    ],
  }),
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPG, PNG, and WEBP are allowed."));
  }
};

export const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});
