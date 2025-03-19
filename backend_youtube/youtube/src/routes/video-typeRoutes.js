import express from "express";
import {createVideoType, deleteVideoType, getVideoType, updateVideoType} from "../services/video-type_service.js";
import {middlewareToken} from "../config/jwt.js";

const videoTypeRoutes = express.Router();

videoTypeRoutes.get('/',middlewareToken, getVideoType);
videoTypeRoutes.post('/', createVideoType)
videoTypeRoutes.post('/:id', updateVideoType)
videoTypeRoutes.post('/:id', deleteVideoType)


export default videoTypeRoutes;