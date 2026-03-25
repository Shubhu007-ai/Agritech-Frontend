import { useNavigate } from "react-router-dom";
import LikeButton from "./LikeButton";
import { useRef } from "react";

const VideoCard = ({ video }) => {
  console.log("VIDEO DATA:", video);
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div className="video-card">
      <video
        ref={videoRef}
        src={`${import.meta.env.VITE_BACKEND_URL}${video.videoUrl}`}
        muted
        preload="metadata"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />

      <div className="video-info">
        <h3>{video.title}</h3>
        <p>{video.description}</p>
        <p
          className="author"
          style={{ cursor: "pointer", color: "#2ecc71" }}
          // onClick={() => {
          //   if (video.uploadedBy && video.uploadedBy._id) {
          //     navigate(`/profile/${video.uploadedBy._id}`);
          //   } else {
          //     alert("User not available");
          //   }
          // }}
        >
          By {video.uploadedBy?.name}
        </p>

        <div className="like-view-btn">
          <LikeButton videoId={video._id} likes={video.likes.length} />

          <button
            className="view-video-btn"
            onClick={() => navigate(`/video/${video._id}`)}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
