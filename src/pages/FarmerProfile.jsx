import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axiosInstance";
import VideoCard from "../components/VideoCard";
import AnimatedWrapper from "../components/AnimatedWrapper";

const FarmerProfile = () => {
  const { id } = useParams();
  if (!id || id === "undefined") {
  return <h2>User not found</h2>;
}
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!id) return;
    axios.get(`/profile/${id}`).then(res => {
      setProfile(res.data);
    });
  }, [id]);

  if (!profile) return <div style={{ padding: 40 }}>Loading...</div>;

  return (
    <AnimatedWrapper>
      <div style={{ padding: 40 }}>
        <h2>{profile.user.name}</h2>
        <p>{profile.user.bio}</p>

        <h3 style={{ marginTop: 30 }}>Uploaded Videos</h3>

        <div className="video-grid">
          {profile.videos.map(video => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      </div>
    </AnimatedWrapper>
  );
};

export default FarmerProfile;
