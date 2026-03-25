import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/FarmingInsights.css";
import axios from "axios";

const FarmingInsights = () => {
  const [activeTab, setActiveTab] = useState("yield");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [yieldData, setYieldData] = useState({
    state: "",
    year: "",
    season: "",
    crop: "",
    area: "",
  });

  const [fertData, setFertData] = useState({
    moisture: "",
    soilType: "",
    cropType: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    humidity: "",
    temperature: "",
  });

  const [cropData, setCropData] = useState({
    n: "",
    p: "",
    k: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
  });

  /* ---------- ENTER KEY NAVIGATION ---------- */

  const handleEnterNext = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const form = e.target.form;
      const index = Array.prototype.indexOf.call(form, e.target);

      if (index < form.elements.length - 1) {
        form.elements[index + 1].focus();
      } else {
        form.requestSubmit();
      }
    }
  };

  const handleYieldChange = (e) =>
    setYieldData({ ...yieldData, [e.target.name]: e.target.value });

  const handleFertChange = (e) =>
    setFertData({ ...fertData, [e.target.name]: e.target.value });

  const handleCropChange = (e) =>
    setCropData({ ...cropData, [e.target.name]: e.target.value });

  /* ---------------- YIELD API ---------------- */

  const handlePredictYield = async (e) => {
    e.preventDefault();

    if (
      !yieldData.state ||
      !yieldData.year ||
      !yieldData.season ||
      !yieldData.crop ||
      !yieldData.area
    ) {
      alert("Please fill all fields before predicting yield.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8001/predict-yield", {
        state: yieldData.state,
        season: yieldData.season,
        crop: yieldData.crop,
        year: Number(yieldData.year),
        area: Number(yieldData.area),
      });

      const data = response.data;

      setResult({
        title: "Estimated Yield",
        value: `${data.predicted_yield.toFixed(2)} Tons/Hectare`,
        sub: `Production: ${data.predicted_production.toFixed(2)} Tons`,
      });
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  /* ---------------- FERTILIZER API ---------------- */

  const handleRecommendFertilizer = async (e) => {
    e.preventDefault();

    if (
      !fertData.moisture ||
      !fertData.soilType ||
      !fertData.cropType ||
      !fertData.nitrogen ||
      !fertData.phosphorus ||
      !fertData.potassium ||
      !fertData.humidity ||
      !fertData.temperature
    ) {
      alert("Please fill all fertilizer inputs.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_FERTILIZER_API_URL,
        {
          temperature: Number(fertData.temperature),
          humidity: Number(fertData.humidity),
          moisture: Number(fertData.moisture),
          soil_type: fertData.soilType,
          crop_type: fertData.cropType,
          nitrogen: Number(fertData.nitrogen),
          potassium: Number(fertData.potassium),
          phosphorous: Number(fertData.phosphorus),
        },
      );

      const data = response.data;

      setResult({
        title: "Best Fertilizer",
        value: data.recommended_fertilizer,
        sub: "Recommended based on soil nutrients",
      });
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  /* ---------------- CROP API ---------------- */

  const handleSuggestCrop = async (e) => {
    e.preventDefault();

    if (
      !cropData.n ||
      !cropData.p ||
      !cropData.k ||
      !cropData.temperature ||
      !cropData.humidity ||
      !cropData.ph ||
      !cropData.rainfall
    ) {
      alert("Please fill all crop inputs.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_CROP_SUGGESTION_API_URL,
        {
          N: Number(cropData.n),
          P: Number(cropData.p),
          K: Number(cropData.k),
          temperature: Number(cropData.temperature),
          humidity: Number(cropData.humidity),
          ph: Number(cropData.ph),
          rainfall: Number(cropData.rainfall),
        },
      );

      const data = response.data;

      setResult({
        title: "Recommended Crop",
        value: data.recommended_crop,
        sub: "AI Based Crop Suggestion",
      });
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  /* ---------------- FORM RENDERERS ---------------- */

  const renderYieldPredictor = () => (
    <div className="fi-form-card">
      <h3 className="fi-form-title">Yield Prediction</h3>

      <form onSubmit={handlePredictYield}>
        <div className="fi-input-grid-2">
          <div className="fi-input-group">
            <label>State</label>
            <input
              type="text"
              name="state"
              placeholder="e.g. Punjab"
              value={yieldData.state}
              onChange={handleYieldChange}
              onKeyDown={handleEnterNext}
            />
          </div>

          <div className="fi-input-group">
            <label>Year</label>
            <input
              type="number"
              placeholder="e.g. 2026"
              name="year"
              value={yieldData.year}
              onChange={handleYieldChange}
              onKeyDown={handleEnterNext}
            />
          </div>

          <div className="fi-input-group">
            <label>Season</label>
            <input
              type="text"
              placeholder="e.g. Kharif"
              name="season"
              value={yieldData.season}
              onChange={handleYieldChange}
              onKeyDown={handleEnterNext}
            />
          </div>

          <div className="fi-input-group">
            <label>Crop</label>
            <input
              type="text"
              placeholder="e.g. Rice"
              name="crop"
              value={yieldData.crop}
              onChange={handleYieldChange}
              onKeyDown={handleEnterNext}
            />
          </div>

          <div className="fi-input-group">
            <label>Area</label>
            <input
              type="number"
              placeholder="e.g. 2 hectares"
              name="area"
              value={yieldData.area}
              onChange={handleYieldChange}
              onKeyDown={handleEnterNext}
            />
          </div>
        </div>

        <button
          type="submit"
          className={`fi-submit-btn ${loading ? "loading" : ""}`}
        >
          {loading ? "Predicting..." : "Predict Yield"}
        </button>
      </form>
    </div>
  );

  /* ---------- Fertilizer and Crop forms remain same except placeholders and enter navigation ---------- */

  const renderFertilizerAI = () => (
    <div className="fi-form-card">
      <h3 className="fi-form-title">Fertilizer Recommendation</h3>

      <form onSubmit={handleRecommendFertilizer}>
        <div className="fi-input-grid-2">
          <div className="fi-input-group">
            <label>Moisture</label>
            <input
              type="number"
              placeholder="e.g. 40"
              name="moisture"
              value={fertData.moisture}
              onChange={handleFertChange}
              onKeyDown={handleEnterNext}
            />
          </div>

          <div className="fi-input-group">
            <label>Humidity</label>
            <input
              type="number"
              placeholder="e.g. 60"
              name="humidity"
              value={fertData.humidity}
              onChange={handleFertChange}
              onKeyDown={handleEnterNext}
            />
          </div>

          <div className="fi-input-group">
            <label>Temperature</label>
            <input
              type="number"
              placeholder="e.g. 28°C"
              name="temperature"
              value={fertData.temperature}
              onChange={handleFertChange}
              onKeyDown={handleEnterNext}
            />
          </div>

          <div className="fi-input-group">
            <label>Soil Type</label>
            <input
              type="text"
              placeholder="e.g. Sandy"
              name="soilType"
              value={fertData.soilType}
              onChange={handleFertChange}
              onKeyDown={handleEnterNext}
            />
          </div>

          <div className="fi-input-group">
            <label>Crop Type</label>
            <input
              type="text"
              placeholder="e.g. Wheat"
              name="cropType"
              value={fertData.cropType}
              onChange={handleFertChange}
              onKeyDown={handleEnterNext}
            />
          </div>

          <div className="fi-input-group">
            <label>Nitrogen</label>
            <input
              type="number"
              placeholder="e.g. 20"
              name="nitrogen"
              value={fertData.nitrogen}
              onChange={handleFertChange}
              onKeyDown={handleEnterNext}
            />
          </div>

          <div className="fi-input-group">
            <label>Phosphorus</label>
            <input
              type="number"
              placeholder="e.g. 15"
              name="phosphorus"
              value={fertData.phosphorus}
              onChange={handleFertChange}
              onKeyDown={handleEnterNext}
            />
          </div>

          <div className="fi-input-group">
            <label>Potassium</label>
            <input
              type="number"
              placeholder="e.g. 10"
              name="potassium"
              value={fertData.potassium}
              onChange={handleFertChange}
              onKeyDown={handleEnterNext}
            />
          </div>
        </div>

        <button
          type="submit"
          className={`fi-submit-btn ${loading ? "loading" : ""}`}
        >
          {loading ? "Processing..." : "Recommend Fertilizer"}
        </button>
      </form>
    </div>
  );

  const renderCropSuggestAI = () => (
    <div className="fi-form-card">
      <h3 className="fi-form-title">Crop Suggest AI</h3>

      <form onSubmit={handleSuggestCrop}>
        <div className="fi-input-grid-2">
          <div className="fi-input-group">
            <label>Nitrogen</label>
            <input
              type="number"
              placeholder="e.g. 20"
              name="n"
              value={cropData.n}
              onChange={handleCropChange}
              onKeyDown={handleEnterNext}
            />
          </div>

          <div className="fi-input-group">
            <label>Phosphorus</label>
            <input
              type="number"
              placeholder="e.g. 15"
              name="p"
              value={cropData.p}
              onChange={handleCropChange}
              onKeyDown={handleEnterNext}
            />
          </div>

          <div className="fi-input-group">
            <label>Potassium</label>
            <input
              type="number"
              placeholder="e.g. 10"
              name="k"
              value={cropData.k}
              onChange={handleCropChange}
              onKeyDown={handleEnterNext}
            />
          </div>

          <div className="fi-input-group">
            <label>Temperature</label>
            <input
              type="number"
              placeholder="e.g. 27°C"
              name="temperature"
              value={cropData.temperature}
              onChange={handleCropChange}
              onKeyDown={handleEnterNext}
            />
          </div>

          <div className="fi-input-group">
            <label>Humidity</label>
            <input
              type="number"
              placeholder="e.g. 70"
              name="humidity"
              value={cropData.humidity}
              onChange={handleCropChange}
              onKeyDown={handleEnterNext}
            />
          </div>

          <div className="fi-input-group">
            <label>pH</label>
            <input
              type="number"
              placeholder="e.g. 6.5"
              name="ph"
              value={cropData.ph}
              onChange={handleCropChange}
              onKeyDown={handleEnterNext}
            />
          </div>

          <div className="fi-input-group">
            <label>Rainfall</label>
            <input
              type="number"
              placeholder="e.g. 120"
              name="rainfall"
              value={cropData.rainfall}
              onChange={handleCropChange}
              onKeyDown={handleEnterNext}
            />
          </div>
        </div>

        <button
          type="submit"
          className={`fi-submit-btn ${loading ? "loading" : ""}`}
        >
          {loading ? "Analyzing..." : "Suggest Crop"}
        </button>
      </form>
    </div>
  );

  const getResultIcon = () => {
    if (activeTab === "yield") return "🌾";
    if (activeTab === "fertilizer") return "💊";
    return "🌱";
  };

  const getResultTitle = () => {
    if (activeTab === "yield") return "Yield Result";
    if (activeTab === "fertilizer") return "Recommendation";
    return "Recommended Crop";
  };

  return (
    <div className="fi-page-wrapper">
      <Navbar />

      <div className="fi-container">
        <h1 className="fi-title">Farming Insights</h1>

        <div className="fi-tabs-container">
          <button
            className={`fi-tab-btn ${activeTab === "yield" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("yield");
              setResult(null);
            }}
          >
            Yield Predictor
          </button>

          <button
            className={`fi-tab-btn ${activeTab === "fertilizer" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("fertilizer");
              setResult(null);
            }}
          >
            Fertilizer AI
          </button>

          <button
            className={`fi-tab-btn ${activeTab === "crop" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("crop");
              setResult(null);
            }}
          >
            Crop Suggest AI
          </button>
        </div>

        <div className="fi-grid">
          <div className="fi-form-section">
            {activeTab === "yield" && renderYieldPredictor()}
            {activeTab === "fertilizer" && renderFertilizerAI()}
            {activeTab === "crop" && renderCropSuggestAI()}
          </div>

          <div className="fi-result-section">
            <div
              className={`fi-result-card ${loading ? "scanning" : "ai-active"}`}
            >
              <div className="fi-result-header">
                <span>{getResultIcon()}</span> {getResultTitle()}
              </div>

              <div className="fi-result-content">
                {result ? (
                  <>
                    <h4>{result.title}</h4>
                    <p>{result.value}</p>

                    <h4>Notes</h4>
                    <p className="fi-result-notes">{result.sub}</p>
                  </>
                ) : (
                  <>
                    <h4>Result</h4>
                    <p>--</p>

                    <h4>Details</h4>
                    <p className="fi-result-notes">--</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmingInsights;
