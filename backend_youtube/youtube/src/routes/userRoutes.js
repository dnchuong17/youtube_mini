import express from "express";
import {
    getUser,
    deleteUser,
    uploadImage,
    uploadMultiImage,
    getUserById,
    getUserProfile
} from "../services/user_service.js";
import {Cloudinary} from "../config/cloudinary.config.js";

const userRoutes = express.Router();

userRoutes.get("/", getUser);
userRoutes.get("/:id", getUserById);
userRoutes.delete("/:id", deleteUser);
userRoutes.post('/upload-image', Cloudinary.single("image"), uploadImage);
userRoutes.post('/upload-multi-images', Cloudinary.array("images"), uploadMultiImage);
userRoutes.get('/me/profile', getUserProfile);


export default userRoutes;