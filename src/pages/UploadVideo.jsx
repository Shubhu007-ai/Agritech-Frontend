import { useState } from "react";
import AnimatedWrapper from "../components/AnimatedWrapper";
import VideoUploadForm from "../components/VideoUploadForm";
import "../styles/uploadVideo.css";

const UploadVideo = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // This function will be passed to VideoUploadForm
  const handleUploadResponse = (response) => {
    if (response?.error) {
      setError(response.error);
      setSuccess("");
    } else if (response?.success) {
      setSuccess(response.success);
      setError("");
    }
  };

  return (
    <AnimatedWrapper>
      <div className="upload-page">
        <div className="upload-container">
          <h1>Upload Farming Video</h1>
          <p>Share your knowledge with farmers across the country.</p>

          {/* Error Message */}
          {error && (
            <div className="upload-error">
              ⚠ {error}
              <p className="upload-hint">
                Try using farming-related keywords like crop, soil, irrigation,
                dairy, organic farming.
              </p>
            </div>
          )}

          {/* Success Message */}
          {success && <div className="upload-success">✔ {success}</div>}

          <div className="upload-card-page">
            <VideoUploadForm onUploadResponse={handleUploadResponse} />
          </div>
        </div>
      </div>
    </AnimatedWrapper>
  );
};

export default UploadVideo;
