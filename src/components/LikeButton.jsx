import { useState } from "react";
import axios from "../api/axiosInstance";

const LikeButton = ({ videoId, likes }) => {
  const [count, setCount] = useState(likes);

  const handleLike = async () => {
    const res = await axios.put(`/videos/like/${videoId}`);
    setCount(res.data.likes);
  };

  return (
    <button className="like-btn" onClick={handleLike}>
      ❤️ {count}
    </button>
  );
};

export default LikeButton;
