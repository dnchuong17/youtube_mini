import {formatVideoList} from "../utils/formatData.js";
import {PrismaClient} from "@prisma/client";
import {send_response} from "../helper/send_response.js";

const { videos} = new PrismaClient({
    log: ["query", "info", "warn", "error"]
});

const getVideo = async (req, res) => {
    try {
        const result = await videos.findMany({where: {}});

        const videosFormated = formatVideoList(result);
        console.log(videosFormated);

        send_response(req, res, "videos", videosFormated);
    } catch (error) {
        return res.send(error);
    }
}

const getVideoById = async (req, res) => {
    try {
        const id = req.params.id;

        const result = await videos.findMany({where: {video_id: +id}});

        const videosFormated = formatVideoList(result);
        send_response(req, res, "videos", videosFormated);
    } catch (error) {
        return res.send(error);
    }
}

const createVideo = async (req, res) => {
    try {
        const { video_name, thumbnail, description, views, type_id, user_id, source } = req.body;
        if (!video_name || !thumbnail || !type_id || !user_id || !source) {
            return res.status(400).send({ error: "Missing required fields" });
        }
        const newVideo = await models.videos.create({ video_name, thumbnail, description, views, type_id, user_id, source });
        return res.send(newVideo);
    } catch (error) {
        return res.send(error)
    }
}

const updateVideo = async (req, res) => {
    try {
        const updated = await models.videos.update(
            req.body,
            { where: { video_id: +req.params.id } }
        );

        return res.send(updated);
    } catch (error) {
        return res.send(error);
    }
};

const deleteVideo = async (req, res) => {
    try {
        await videos.delete(
            { where: { video_id: +req.params.id } }
        );
        return res.send();
    } catch (error) {
        return res.send(error);
    }
};


export {
    getVideo,
    getVideoById,
    createVideo,
    updateVideo,
    deleteVideo
}