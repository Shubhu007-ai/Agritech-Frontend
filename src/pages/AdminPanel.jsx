import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import AnimatedWrapper from "../components/AnimatedWrapper";

const AdminPanel = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    axios.get("/videos").then(res => setVideos(res.data));
  }, []);

  const deleteVideo = async (id) => {
    await axios.delete(`/videos/${id}`);
    setVideos(videos.filter(v => v._id !== id));
  };

  return (
    <AnimatedWrapper>
      <div style={{ padding: 40 }}>
        <h1>Admin Dashboard</h1>

        {videos.map(video => (
          <div key={video._id} style={{ marginBottom: 20 }}>
            <strong>{video.title}</strong>
            <button
              onClick={() => deleteVideo(video._id)}
              style={{
                marginLeft: 20,
                background: "red",
                color: "white",
                border: "none",
                padding: 6,
                borderRadius: 6
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </AnimatedWrapper>
  );
};

export default AdminPanel;
