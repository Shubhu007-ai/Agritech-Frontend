import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import { motion } from "framer-motion";
import {
  FaBookmark,
  FaRegBookmark,
  FaShareAlt,
  FaEye
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import CommentSection from "../components/CommentSection";
import "../styles/videoDetail.css";

const VideoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [allVideos, setAllVideos] = useState([]);
  const [bookmarked, setBookmarked] = useState(false);

  // ✅ Get logged in user
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = storedUser?.id;

  useEffect(() => {
    axios.get("/videos").then(res => {
      setAllVideos(res.data);

      const found = res.data.find(v => v._id === id);
      setVideo(found);

      axios.put(`/videos/view/${id}`);
    });
  }, [id]);

  const toggleBookmark = async () => {
    await axios.put(`/profile/bookmark/${id}`);
    setBookmarked(!bookmarked);
  };

  const shareVideo = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied!");
  };

  // ✅ Related Videos Logic (Same Category + Exclude Current)
  // ✅ Related Logic: Priority based
  const relatedVideos = allVideos
    .filter(v => v._id !== id) // exclude current video
    .sort((a, b) => {
      // Same category first
      if (a.category === video?.category && b.category !== video?.category) {
        return -1;
      }
      if (a.category !== video?.category && b.category === video?.category) {
        return 1;
      }

      // If same priority, sort by views (descending)
      return b.views - a.views;
    });


  if (!video) return <div className="loading">Loading...</div>;

  return (
    <>
      <Navbar />

      <motion.div
        className="video-detail-wrapper"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="video-content">

          <div className="video-left">

            <motion.video
              whileHover={{ scale: 1.01 }}
             src={video.videoUrl}
              controls
              className="premium-video"
            />

            <div className="video-info">
              <h1>{video.title}</h1>

              <div className="video-meta">
                <span className="badge">{video.category}</span>

                <span>
                  <FaEye /> {video.views} views
                </span>

                <div className="icon-actions">
                  <button onClick={toggleBookmark}>
                    {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
                  </button>

                  <button onClick={shareVideo}>
                    <FaShareAlt />
                  </button>
                </div>
              </div>

              <div className="farmer-info">
                <div className="avatar-circle">
                  {video.uploadedBy?.name?.charAt(0)}
                </div>
                <span>{video.uploadedBy?.name}</span>
              </div>

              <p>{video.description}</p>
            </div>
          </div>

          {/* ✅ Updated Related Section */}
          <div className="video-right">
            <h3>Related Knowledge</h3>

            {relatedVideos.map(v => {
              const isRelated = v.category === video.category;

              return (
                <div
                  key={v._id}
                  className="related-card clickable"
                  onClick={() => navigate(`/video/${v._id}`)}
                >
                  <video
                    src={`${import.meta.env.VITE_BACKEND_URL}${v.videoUrl}`}
                    className="related-thumb"
                    muted
                  />

                  <div className="related-info">
                    <p className="related-title">
                      {v.title}
                    </p>

                    {isRelated && (
                      <span className="related-badge">
                        Related
                      </span>
                    )}

                    <span className="related-meta">
                      {v.views} views
                    </span>
                  </div>
                </div>
              );
            })}

          </div>

        </div>

        <div className="comment-section-wrapper">
          <CommentSection
            videoId={video._id}
            currentUser={currentUserId}
          />
        </div>
      </motion.div>
    </>
  );
};

export default VideoDetail;
