import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRETE_KEY
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'images', //place to save images, if dont have folder named "images", it will create
        format: async (req, file) => {
            const allowFormats = ['png', 'jpg', 'gif', 'webp', 'jpeg'];

            const fileFormat = file.mimetype.split("/")[1];

            if (allowFormats.includes(fileFormat)) {
                return fileFormat;
            }

            return 'png';
        },
        public_id: (req, file) => {
            const newName = new Date().getTime() + "_" + file.originalname.split(".")[0];
            return newName;
        }
    }
});

export const Cloudinary = multer({storage});