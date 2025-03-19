import express from "express";
import {createVideo, deleteVideo, getVideo, getVideoById, updateVideo} from "../services/video_service.js";

const videoRoutes = express.Router();

videoRoutes.get("/", getVideo);
videoRoutes.get("/:id", getVideoById);
videoRoutes.post("/", createVideo);
videoRoutes.put("/:id", updateVideo);
videoRoutes.delete("/:id", deleteVideo);


export default videoRoutes;