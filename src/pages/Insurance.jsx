import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/Insurance.css";

const Insurance = () => {
  const [acreage, setAcreage] = useState("");
  const [cropType, setCropType] = useState("Wheat");
  const [premium, setPremium] = useState(null);

  const calculatePremium = (e) => {
    e.preventDefault();
    const baseRate = 450; 
    const cropFactor = cropType === "Wheat" ? 1.2 : cropType === "Rice" ? 1.5 : 1.8;
    const estimated = acreage * baseRate * cropFactor;
    setPremium(estimated.toFixed(0));
  };

  const plans = [
    {
      id: 1,
      title: "PM Fasal Bima Yojana",
      provider: "Govt. of India",
      coverage: "₹2,00,000 / acre",
      desc: "Comprehensive crop insurance against non-preventable natural risks like drought, flood, and pests.",
      badge: "Government"
    },
    {
      id: 2,
      title: "Weather Shield Pro",
      provider: "HDFC Ergo",
      coverage: "₹1,50,000 / acre",
      desc: "Parametric insurance that pays out automatically based on rainfall and temperature data.",
      badge: "Private"
    },
    {
      id: 3,
      title: "Crop Income Secure",
      provider: "ICICI Lombard",
      coverage: "₹3,00,000 / year",
      desc: "Guarantees a minimum income for the farmer regardless of yield or market price fluctuation.",
      badge: "Premium"
    }
  ];

  return (
    <>
      <Navbar />
      <div className="insurance-page-container">
        
        <div className="insurance-header">
          <h1>🛡️ Agri-Insurance</h1>
          <p>Secure your crops against nature's uncertainties with trusted plans.</p>
        </div>

        <div className="insurance-content-grid">
           
          {/* LEFT: Calculator Card */}
          <div className="insurance-card calculator-card">
            <h2>📊 Premium Calculator</h2>
            <form onSubmit={calculatePremium} className="insurance-form">
              <div className="form-group">
                <label>Crop Type</label>
                <select value={cropType} onChange={(e) => setCropType(e.target.value)}>
                  <option value="Wheat">Wheat</option>
                  <option value="Rice">Rice</option>
                  <option value="Sugarcane">Sugarcane</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Maize">Maize</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Land Area (Acres)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 5" 
                  value={acreage} 
                  onChange={(e) => setAcreage(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="calc-btn">Calculate Premium</button>
            </form>

            {premium && (
              <div className="result-box">
                <p>Estimated Annual Premium</p>
                <h3>₹ {premium}</h3>
              </div>
            )}
          </div>

          {/* RIGHT: Insurance Plans List */}
          <div className="plans-list">
            <h2 className="section-title">Featured Plans</h2>
            
            {plans.map((plan) => (
              <div key={plan.id} className="plan-card">
                <div className="plan-header">
                  <div>
                    <h3>{plan.title}</h3>
                    <p className="provider">by {plan.provider}</p>
                  </div>
                  <span className={`plan-badge ${plan.badge.toLowerCase()}`}>
                    {plan.badge.toUpperCase()}
                  </span>
                </div>
                
                <p className="plan-desc">{plan.desc}</p>
                
                <div className="plan-footer">
                  <span className="coverage">Coverage: <strong>{plan.coverage}</strong></span>
                  <button className="apply-btn">Apply Now →</button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
};

export default Insurance;