import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import cloudinary from "../config/cloudinary";

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

export const uploadAvatar = multer({
  storage: avatarStorage,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});
