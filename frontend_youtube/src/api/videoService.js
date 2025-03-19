import apiClient from "./apiClient";

// lấy danh sách video type
export const getVideoTypes = async () => {
    try {
        const response = await apiClient.get("/sidebar");
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const getVideos = async () => {
    try {
        const videos = await apiClient.get("/videos");
        return videos.data.data;
    } catch (error) {
        throw error;
    }
}

export const getVideoType = async () => {
    try {
        const videoTypes = await apiClient.get("/video-types");
        console.log("video types:", videoTypes.data)
        return videoTypes.data;
    } catch (error) {
        throw error;
    }
}