import { PrismaClient } from "@prisma/client";
import {send_response} from "../helper/send_response.js";
import {handle_error} from "../helper/handle_error.js";

const { users} = new PrismaClient({
    log: ["query", "info", "warn", "error"]
});

const getUser = async (req, res) => {
    try {
        const result = await users.findMany({});

        send_response(req, res, "users", result);
    } catch (error) {
        handle_error(error, res);
    }
};

const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await users.findUnique({
            where: { user_id: +id }
        });

        send_response(req, res, "users", result);
    } catch (error) {
        console.error('Error:', error);
        handle_error(error, res);
    }
};

const deleteUser = async (req, res) => {
    try {
        await users.delete({where: {user_id: +req.params.id}});
        return res.send();
    } catch (error) {
        return res.send('Error: ', error);
    }
}

const uploadImage = async (req, res) => {
    try {
        const file = req.file;
        return res.json(file);
    } catch (error) {
        return res.send('Error', error);
    }
}

const uploadMultiImage = async (req, res) => {
    try {
        const files = req.files;
        return res.json(files);
    } catch (error) {
        return res.send('Error', error);
    }
}

const getUserProfile = async (req, res) => {
    try {

        let userId = req.userId;
        console.log(userId);
        let userExist = await users.findFirst({
            where: {
                user_id: +userId
            }
        })

        let response = userExist;
        if(userExist.avatar) {
            response = {
                ...userExist,
                avatar: `${process.env.BASE_URL}/public/images/${userExist.avatar}`
            }
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log("getUserProfile error", error);
        return res.status(500).json({message: "Error get user profile"});
    }
}

export {
    getUser,
    getUserById,
    deleteUser,
    uploadImage,
    uploadMultiImage,
    getUserProfile
}