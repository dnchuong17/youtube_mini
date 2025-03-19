import {PrismaClient} from "@prisma/client";

const { video_types} = new PrismaClient({
    log: ["query", "info", "warn", "error"]
});

const getVideoType = async (req, res) => {
    try {
        let result = await video_types.findMany({where: {}});

        return res.send(result);
    } catch (error) {
        res.send(error);
    }
}

const createVideoType = async (req, res) => {
    try {
        const { type_name, icon } = req.body;

        if (!type_name) {
            return res.send({ error: "Missing required field" });
        }
        const newVideoType = await video_types.create({ type_name, icon });
        return res.send(newVideoType);
    } catch (error) {
        return res.send(error)
    }
}

const updateVideoType = async (req, res) => {
    try {
        const updated = await video_types.update(
            req.body,
            { where: { video_id: +req.params.id } }
        );

        return res.send(updated);
    } catch (error) {
        return res.send(error);
    }
};

const deleteVideoType = async (req, res) => {
    try {
        await video_types.delete(
            { where: { video_id: +req.params.id } }
        );
        return res.send();
    } catch (error) {
        return res.send(error);
    }
};

export {
    getVideoType,
    createVideoType,
    updateVideoType,
    deleteVideoType
}