import React, { useState, useRef, useEffect } from "react";
import api from "../api/axios";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Navbar from "../components/Navbar";
import SoilTrendChart from "./SoilTrendChart";
import "../styles/SoilReport.css";

const SoilReport = () => {
  const [showReport, setShowReport] = useState(false);
  const [history, setHistory] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const reportRef = useRef();

  // --- 1. USER ID LOGIC ---
  const getUserId = () => {
    const directId = localStorage.getItem("userId");
    if (directId && directId !== "undefined") return directId;

    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        return userObj.id || userObj._id || userObj.userId;
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  };
  const currentUserId = getUserId();

  const [formData, setFormData] = useState({
    n: "",
    p: "",
    k: "",
    ph: "",
    carbon: "",
  });

  // --- 2. FETCH HISTORY ---
  useEffect(() => {
    const fetchHistory = async () => {
      if (!currentUserId) return;
      try {
        const res = await api.get(`/soil/history/${currentUserId}`);
        setHistory(res.data);
      } catch (err) {
        console.error("Fetch history error:", err);
      }
    };
    fetchHistory();
  }, [showReport, currentUserId]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- 3. LIVE API INTEGRATION (FIXED 422 ERROR) ---
  const fetchRecommendationFromAPI = async (data) => {
    try {
      // Formatted payload to standard ML expectations to avoid 422
      const payload = {
        Nitrogen: parseFloat(data.n),
        Phosphorus: parseFloat(data.p),
        Potassium: parseFloat(data.k),
        pH: parseFloat(data.ph),
        "Organic Carbon": parseFloat(data.carbon),
        // Fallback standard keys just in case your backend accepts these
        nitrogen: parseFloat(data.n),
        phosphorus: parseFloat(data.p),
        potassium: parseFloat(data.k),
        ph: parseFloat(data.ph),
        organic_carbon: parseFloat(data.carbon),
      };

      const response = await axios.post(
        import.meta.env.VITE_SOIL_ANALYSIS_API_URL,
        payload,
      );

      if (response.data && response.data.soil_report) {
        return response.data;
      } else {
        throw new Error("Unexpected API format");
      }
    } catch (error) {
      // Logs exact reason if API fails validation
      if (error.response && error.response.status === 422) {
        console.error(
          "🔥 API 422 VALIDATION ERROR! Check expected keys:",
          error.response.data,
        );
      } else {
        console.log(
          "API failed. Using Local Fallback Analysis.",
          error.message,
        );
      }
      return getLocalFallbackAnalysis(data);
    }
  };

  // --- 4. FALLBACK LOGIC ---
  const getLocalFallbackAnalysis = (data) => {
    const n = parseFloat(data.n);
    const p = parseFloat(data.p);
    const k = parseFloat(data.k);
    const ph = parseFloat(data.ph);

    return {
      soil_report: {
        soil_fertility: n < 30 || p < 20 || k < 150 ? "Low" : "Medium",
        nutrient_status: {
          Nitrogen: n < 30 ? "Low" : "Adequate",
          Phosphorus: p < 20 ? "Low" : "Adequate",
          Potassium: k < 150 ? "Low" : "Adequate",
          "pH Status": ph < 6.5 ? "Acidic" : ph > 7.5 ? "Alkaline" : "Neutral",
        },
      },
      ai_explanation:
        "Recommendation:\nBased on local fallback calculations:\n" +
        (n < 30
          ? "- Apply additional nitrogen fertilizer to improve soil fertility.\n"
          : "") +
        (p < 20 ? "- Add Phosphorus.\n" : "") +
        (k < 150 ? "- Apply Muriate of Potash.\n" : "") +
        (ph < 6.5
          ? "- Monitor the soil pH level and apply Lime to neutralize.\n"
          : "Maintain current fertilization practices."),
    };
  };

  // --- 5. GENERATE REPORT & UPDATE CHART INSTANTLY ---
  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsAnalyzing(true);

    const analysis = await fetchRecommendationFromAPI(formData);
    setAnalysisResult(analysis);

    const newReportStatus =
      analysis.soil_report.soil_fertility === "Low"
        ? "Needs Attention"
        : "Healthy";

    // OPTIMISTIC CHART UPDATE: Instantly add to chart even if not logged in
    const newReportForChart = {
      _id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      nutrients: {
        nitrogen: parseFloat(formData.n),
        phosphorus: parseFloat(formData.p),
        potassium: parseFloat(formData.k),
        carbon: parseFloat(formData.carbon),
        ph: parseFloat(formData.ph),
      },
      status: newReportStatus,
    };
    setHistory((prevHistory) => [newReportForChart, ...prevHistory]);

    // Attempt Database Save
    try {
      if (currentUserId) {
        await api.post("/soil/save-report", {
          userId: currentUserId,
          nutrients: newReportForChart.nutrients,
          status: newReportStatus,
        });
      } else {
        console.warn(
          "User not logged in. Report added to chart locally but won't save to database.",
        );
      }
    } catch (err) {
      console.error("Failed to save to database:", err);
    }

    setIsAnalyzing(false);
    setShowReport(true);
  };

  // --- 6. PDF DOWNLOAD ---
  const downloadPDF = () => {
    html2canvas(reportRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("AgriTech_Soil_Report.pdf");
    });
  };

  const getStatusClass = (status) => {
    if (!status) return "optimal";
    const s = status.toLowerCase();
    if (
      s === "adequate" ||
      s === "neutral" ||
      s === "high" ||
      s === "medium" ||
      s === "healthy"
    )
      return "optimal";
    if (s === "low" || s === "acidic" || s === "alkaline") return "low";
    return s.replace(" ", "-");
  };

  return (
    <div className="sr-page-wrapper">
      <Navbar />
      <div className="sr-container">
        {!showReport ? (
          <div className="sr-input-view">
            <div className="sr-form-card">
              <div className="sr-card-header">
                <h1>🌱 Soil Health Analysis</h1>
                <p>
                  Enter your soil test values below for an instant AI-driven
                  recommendation.
                </p>
              </div>
              <form onSubmit={handleGenerate}>
                <div className="sr-input-grid">
                  <div className="sr-field">
                    <label htmlFor="n">
                      Nitrogen (N) <span className="sr-unit">mg/kg</span>
                    </label>
                    <input
                      id="n"
                      name="n"
                      type="number"
                      placeholder="e.g. 50"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="sr-field">
                    <label htmlFor="p">
                      Phosphorus (P) <span className="sr-unit">mg/kg</span>
                    </label>
                    <input
                      id="p"
                      name="p"
                      type="number"
                      placeholder="e.g. 25"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="sr-field">
                    <label htmlFor="k">
                      Potassium (K) <span className="sr-unit">mg/kg</span>
                    </label>
                    <input
                      id="k"
                      name="k"
                      type="number"
                      placeholder="e.g. 150"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="sr-field">
                    <label htmlFor="carbon">
                      Organic Carbon <span className="sr-unit">%</span>
                    </label>
                    <input
                      id="carbon"
                      name="carbon"
                      type="number"
                      step="0.01"
                      placeholder="e.g. 0.5"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="sr-field">
                    <label htmlFor="ph">
                      pH Level of water <span className="sr-unit">pH</span>
                    </label>
                    <input
                      id="ph"
                      name="ph"
                      type="number"
                      step="0.1"
                      placeholder="e.g. 6.5"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <button
                  className="sr-main-btn"
                  type="submit"
                  disabled={isAnalyzing}
                >
                  {isAnalyzing
                    ? "ANALYZING DATA WITH AI..."
                    : "GENERATE REPORT"}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="sr-report-dashboard-view">
            <div className="sr-report-paper" ref={reportRef}>
              <header className="sr-report-header">
                <div className="sr-report-title">
                  <h2>Soil Health Report</h2>
                  <span className="sr-date-badge">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
                <div className="sr-logo-area">AgriTech Lab</div>
              </header>

              {/* 2 COLUMN GRID (UPDATED LAYOUT) */}
              <div className="sr-dashboard-grid">
                {/* LEFT COLUMN: Nutrients & pH Gauge stacked */}
                <div
                  className="sr-left-column"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "30px",
                  }}
                >
                  {/* TOP LEFT: NUTRIENTS */}
                  <div className="sr-analysis-card">
                    <h3>🧪 Macro-Nutrient Analysis</h3>
                    {[
                      {
                        l: "Nitrogen",
                        unit: "N",
                        s: analysisResult.soil_report.nutrient_status.Nitrogen,
                        v: formData.n,
                        max: 100,
                      },
                      {
                        l: "Phosphorus",
                        unit: "P",
                        s: analysisResult.soil_report.nutrient_status
                          .Phosphorus,
                        v: formData.p,
                        max: 60,
                      },
                      {
                        l: "Potassium",
                        unit: "K",
                        s: analysisResult.soil_report.nutrient_status.Potassium,
                        v: formData.k,
                        max: 300,
                      },
                      {
                        l: "Carbon",
                        unit: "OC",
                        s:
                          parseFloat(formData.carbon) < 0.5
                            ? "Low"
                            : "Adequate",
                        v: formData.carbon,
                        max: 1.5,
                      },
                    ].map((item, i) => (
                      <div className="sr-stat-row" key={i}>
                        <div className="sr-stat-info">
                          <span>
                            {item.l} <small>({item.unit})</small>
                          </span>
                          <span>
                            {item.v}{" "}
                            <span
                              className={`sr-badge sr-${getStatusClass(item.s)}`}
                            >
                              {item.s || "Adequate"}
                            </span>
                          </span>
                        </div>
                        <div className="sr-progress-bg">
                          <div
                            className={`sr-progress-fill sr-${getStatusClass(item.s)}`}
                            style={{
                              width: `${Math.min((item.v / item.max) * 100, 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* BOTTOM LEFT: pH GAUGE */}
                  <div className="sr-analysis-card">
                    <h3>💧 Soil pH Level</h3>
                    <div className="sr-ph-gauge-wrapper">
                      <div
                        className="sr-ph-gauge-circle"
                        style={{
                          background: `conic-gradient(var(--sr-gauge-ring-fill) ${(formData.ph / 14) * 360}deg, var(--sr-gauge-ring-empty) 0deg)`,
                        }}
                      >
                        <div className="sr-gauge-center">
                          <span className="sr-ph-value-large">
                            {formData.ph}
                          </span>
                          <span className="sr-ph-status-label">
                            {analysisResult.soil_report.nutrient_status[
                              "pH Status"
                            ] || "Neutral"}
                          </span>
                        </div>
                      </div>
                      <p
                        className="sr-ph-footer-text"
                        style={{ textAlign: "center", marginTop: "10px" }}
                      >
                        {analysisResult.soil_report.nutrient_status[
                          "pH Status"
                        ] === "Neutral"
                          ? "Ideal for nutrient absorption."
                          : "Requires adjustment."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: AI Insights & Recommendations */}
                <div className="sr-right-column">
                  <div
                    className={`sr-advisory-box ${analysisResult.soil_report.soil_fertility === "Low" ? "sr-alert" : "sr-good"}`}
                    style={{
                      height: "100%",
                      margin: 0,
                      boxSizing: "border-box",
                    }}
                  >
                    <h4>🤖 AI Insights & Recommendations</h4>
                    <div
                      style={{
                        whiteSpace: "pre-wrap",
                        lineHeight: "1.6",
                        marginTop: "15px",
                      }}
                    >
                      {analysisResult.ai_explanation}
                    </div>
                  </div>
                </div>
              </div>
              {/* END OF 2 COLUMN GRID */}
            </div>

            {/* HISTORICAL TRENDS SECTION (Now always visible!) */}
            <div className="sr-history-section" style={{ marginTop: "30px" }}>
              <h3 style={{ marginBottom: "20px" }}>📊 Historical Trends</h3>

              {history.length > 0 ? (
                <>
                  <SoilTrendChart historyData={history} />
                  <div className="sr-history-table-container">
                    <table className="sr-history-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>N</th>
                          <th>P</th>
                          <th>K</th>
                          <th>C(%)</th>
                          <th>pH</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {history.map((h) => (
                          <tr key={h._id}>
                            <td>
                              {new Date(h.createdAt).toLocaleDateString()}
                            </td>
                            <td>{h.nutrients.nitrogen}</td>
                            <td>{h.nutrients.phosphorus}</td>
                            <td>{h.nutrients.potassium}</td>
                            <td>{h.nutrients.carbon}</td>
                            <td>{h.nutrients.ph}</td>
                            <td>
                              <span
                                className={`sr-badge sr-${getStatusClass(h.status)}`}
                              >
                                {h.status || "Healthy"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <p
                  style={{
                    color: "var(--sr-text-soft)",
                    padding: "20px 0",
                    textAlign: "center",
                    background: "var(--sr-input-bg)",
                    borderRadius: "8px",
                  }}
                >
                  No historical data found. Generate more reports to see your
                  soil trends over time.
                </p>
              )}
            </div>

            <div className="sr-action-footer">
              <button
                className="sr-secondary-btn"
                onClick={() => setShowReport(false)}
              >
                ← New Analysis
              </button>
              <button className="sr-download-btn" onClick={downloadPDF}>
                Download PDF 📥
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SoilReport;
