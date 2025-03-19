import React, {useEffect, useState} from "react";
import "../style/VideoList.css";
import { useSidebar } from "../contexts/SidebarContext";
import {getVideos, getVideoType } from "../api/videoService.js";

const VideoList = () => {
  const { isVideoListExpanded } = useSidebar();
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await getVideos();
        setVideos(response);
      } catch (error) {
        setVideos([]);
      }
    };
    const fetchVideoTypes = async () => {
      try {
        const response = await getVideoType();
        setCategories(response);
      } catch (error) {
        setCategories([]);
      }
    }
      fetchVideoTypes();
      fetchVideos();
  }, []);

  return (
    <div className={`container ${isVideoListExpanded ? "large-container" : ""}`}>
      <div className="banner">
        <img src="/src/assets/banner.png" alt="banner image"/>
      </div>

      <div className="categories">
        {categories.map((category) => (
          <button
            key={category.type_id}
            className={`category-item ${category.id === "Tất cả" ? "active" : ""}`}
          >
            {category.type_name}
          </button>
        ))}
      </div>

      <div className="list-container">
        {videos.map((video) => (
          <div className="vid-list" key={video.id}>
            <a href={`/play-video/${video.id}`} className="thumbnail-container">
              <img src={video.thumbnail} alt="Thumbnail" className="thumbnail" />
              <span className="video-duration">0:0</span>
            </a>
            <div className="flex-div">
              <img src="/src/assets/jack.png" alt="" />
              <div className="vid-info">
                <a href="/play-video">{video.title}</a>
                <p>Easy Tutorials</p>
                <p>15k Views &bull; 2 days ago</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoList;
