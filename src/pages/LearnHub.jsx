import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import VideoCard from "../components/VideoCard";
import AnimatedWrapper from "../components/AnimatedWrapper";
import Navbar from "../components/Navbar";
import "../styles/learnHub.css";

const LearnHub = () => {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");
  const [category] = useState("All");

  const navigate = useNavigate();

  const fetchVideos = () => {
    axios.get("/videos").then(res => setVideos(res.data));
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const filtered = videos.filter(video => {
    const matchSearch =
      video.title.toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      category === "All" || video.category === category;

    return matchSearch && matchCategory;
  });

  return (
    <>
      <Navbar />

      <AnimatedWrapper>
        <div className="learn-container">

          {/* HEADER */}
          <div className="learn-header">
            <div>
              <h1>Agri Knowledge Hub</h1>
              <p>Explore and learn modern farming techniques.</p>
            </div>

            <button
              className="video-upload-btn"
              onClick={() => navigate("/upload-video")}
            >
              Upload Video
            </button>
          </div>

          {/* SEARCH + FILTER */}
          <div className="filter-bar">
            <input
              placeholder="Search farming videos..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

          </div>

          {/* VIDEO GRID */}
          <div className="video-grid">
            {filtered.map(video => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>

        </div>
      </AnimatedWrapper>
    </>
  );
};

export default LearnHub;
