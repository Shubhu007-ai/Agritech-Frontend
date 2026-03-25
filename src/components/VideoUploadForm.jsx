import { useState, useRef } from "react";
import axios from "../api/axiosInstance";
import Navbar from "./Navbar";

const VideoUploadForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category] = useState("Crop");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [videoSize, setVideoSize] = useState(null);
  const [videoDuration, setVideoDuration] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [success, setSuccess] = useState(false);


  const fileInputRef = useRef(null);

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    setFile(selectedFile);
    if (preview) URL.revokeObjectURL(preview);
    setVideoSize((selectedFile.size / (1024 * 1024)).toFixed(2)); // MB
    setPreview(URL.createObjectURL(selectedFile));

    // Extract duration + thumbnail
    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = URL.createObjectURL(selectedFile);

    video.onloadedmetadata = () => {
      const duration = video.duration;

      // 🚫 Restrict length (2 minutes max)
      if (duration > 120) {
        alert("Video must be less than 2 minutes.");
        handleRemove();
        return;
      }

      setVideoDuration(Math.floor(duration));

      // Generate thumbnail
      video.currentTime = 1;
    };

    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageURL = canvas.toDataURL("image/png");
      setThumbnail(imageURL);
    };
  };


  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("video")) {
      handleFile(droppedFile);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    setVideoSize(null);
    setVideoDuration(null);
    setThumbnail(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("video", file);

    try {
      setUploading(true);
      setProgress(0);

      await axios.post("/videos/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          const percent = Math.round(
            (event.loaded * 100) / event.total
          );
          setProgress(percent);
        }
      });

      alert("Video uploaded successfully!");

      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);


      setTitle("");
      setDescription("");
      handleRemove();
      setUploading(false);

    } catch (err) {
      setUploading(false);
      setProgress(0);

      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Upload failed. Please try again.");
      }

      console.error(err);
    }
  };

  return (
    <>
      <Navbar />

      <form className="upload-form-modern" onSubmit={handleUpload}>
        <input
          placeholder="Video title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Explain about your farming experience..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        {/* DRAG & DROP AREA */}
        <div
          className="drag-drop-area"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          {!preview ? (
            <>
              <p>Drag & drop your video here</p>
              <span>or</span>
              <label className="file-label">
                Browse File
                <input
                  type="file"
                  accept="video/*"
                  hidden
                  ref={fileInputRef}
                  onChange={(e) => handleFile(e.target.files[0])}
                />
              </label>
            </>
          ) : (
            <>
              <video src={preview} controls className="video-preview" />

              {/* Thumbnail Preview */}
              {thumbnail && (
                <div className="thumbnail-preview">
                  <p>Auto Generated Thumbnail:</p>
                  <img src={thumbnail} alt="thumbnail" />
                </div>
              )}

              {/* Video Info */}
              <div className="video-meta-info">
                <p>Size: {videoSize} MB</p>
                <p>Duration: {videoDuration} sec</p>
              </div>

              <div className="preview-actions">
                <label
                  htmlFor={!uploading ? "videoReplaceInput" : undefined}
                  className={`replace-upload-video-btn ${uploading ? "disabled-btn" : ""}`}
                >
                  Replace
                </label>


                <input
                  id="videoReplaceInput"
                  type="file"
                  accept="video/*"
                  hidden
                  ref={fileInputRef}
                  disabled={uploading}
                  onChange={(e) => handleFile(e.target.files[0])}
                />


                <button
                  type="button"
                  className="remove-upload-video-btn"
                  onClick={handleRemove}
                   disabled={uploading}
                >
                  Remove
                </button>
              </div>
            </>

          )}
        </div>

        {uploading && (
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <button className="upload-video-btn" type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Video"}
        </button>
      </form >
      {success && (<div className="upload-success">✅ Video uploaded successfully!</div>)}
    </>
  );
};

export default VideoUploadForm;
