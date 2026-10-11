import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.config.ts";

const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "dev-hub/avatars",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      public_id: `avatar-${Date.now()}-${Math.round(Math.random() * 1e9)}`,
    };
  },
});

export default avatarStorage;
