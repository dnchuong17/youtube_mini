import express from "express";
import userRoutes from "./userRoutes.js";
import videoRoutes from "./videoRoutes.js";
import videoTypeRoutes from "./video-typeRoutes.js";
import authRoutes from "./authRoutes.js";
import {middlewareToken} from "../config/jwt.js";

const rootRoutes = express.Router();

rootRoutes.use('/users', userRoutes);
rootRoutes.use('/videos', videoRoutes);
rootRoutes.use('/video-types',middlewareToken, videoTypeRoutes);
rootRoutes.use('/auth', authRoutes);

export default rootRoutes;