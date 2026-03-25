import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import '../styles/DiseaseDetector.css';

const DiseaseDetector = () => {
    const [image, setImage] = useState(null);
    const [fileObj, setFileObj] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(URL.createObjectURL(e.target.files[0]));
            setFileObj(e.target.files[0]);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setFileObj(null);
        setResult(null);
    };

    const analyzeImage = async () => {
        if (!fileObj) return;

        setLoading(true);
        setResult(null);

        const formData = new FormData();
        formData.append("file", fileObj);

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/predict`, {

                method: "POST",
                body: formData,
            });

            const data = await response.json();
            setResult(data);

        } catch (err) {
            console.log("Error:", err);
            setResult({ error: "Failed to analyze image" });
        }

        setLoading(false);
    };

    return (
        <div className="tool-page">
            <Navbar />

            <div className="tool-container">
                <header>
                    <h1 className="detector-title">🌿 Crop Disease Detector</h1>
                    <p className="detector-desc">Upload a photo and detect plant diseases instantly.</p>
                </header>

                {/* UPLOAD UI – show only when result is NOT visible */}
                {!result && (
                    <div className="upload-box">

                        <div className={`drop-zone ${image ? 'no-padding' : ''}`}>
                            {!image ? (
                                <>
                                    <span className="upload-icon">📸</span>
                                    <input type="file" onChange={handleFileChange} />
                                    <p>Drag & drop or click to upload</p>
                                </>
                            ) : (
                                <div className="preview-wrapper">
                                    <img src={image} className="preview-img" alt="preview" />
                                </div>
                            )}
                        </div>

                        {image && (
                            <>
                                <button className="analyze-btn" onClick={analyzeImage}>
                                    {loading ? "Analyzing..." : "Analyze Crop"}
                                </button>

                                <button className="remove-btn" onClick={handleRemoveImage}>
                                    Remove Image
                                </button>
                            </>
                        )}

                    </div>
                )}

                {/* RESULT UI */}
                {result && (
                    <div className="disease-result-box fade-in">
                        {result.error ? (
                            <p className="error-text">{result.error}</p>
                        ) : (
                            <>
                                <h2 className="result-title">Analysis Complete</h2>

                                <img src={image} className="result-img" alt="leaf" />

                                <p className="result-disease-label">Detected Disease:</p>
                                <h4 className="result-disease">
                                    {(result.class || result.disease || "Not Found").replace(/_/g, " ")}
                                </h4>

                                <p className="result-disease-label">Confidence Level:</p>
                                <h4 className="result-confidence">{result.confidence}%</h4>

                                <div className="confidence-bar">
                                    <div
                                        className="confidence-fill"
                                        style={{ width: `${result.confidence}%` }}
                                    />
                                </div>

                                <button className="try-again-btn" onClick={handleRemoveImage}>
                                    Try Another Image
                                </button>
                            </>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

export default DiseaseDetector;
