import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/Finance.css";

const Finance = () => {
  const [income, setIncome] = useState("");
  const [loanAmount, setLoanAmount] = useState(null);

  const checkEligibility = (e) => {
    e.preventDefault();
    if (income) {
      setLoanAmount((income * 5).toLocaleString("en-IN"));
    }
  };

  const schemes = [
    {
      id: 1,
      title: "Kisan Credit Card (KCC)",
      type: "Credit",
      interest: "4% p.a.",
      desc: "Provides short-term credit for crops, and term loans for agriculture allied activities.",
    },
    {
      id: 2,
      title: "Agriculture Infrastructure Fund",
      type: "Subsidy",
      interest: "3% Interest Subvention",
      desc: "Financing facility for post-harvest management infrastructure and community farming assets.",
    },
    {
      id: 3,
      title: "NABARD Warehousing Scheme",
      type: "Loan",
      interest: "Low Interest",
      desc: "Financial support for construction of warehouses, godowns, silos, and cold storage units.",
    }
  ];

  return (
    <>
      <Navbar />
      <div className="finance-page-container">
        
        <div className="finance-header">
          <h1>💰 Agri-Finance Support</h1>
          <p>Access loans, subsidies, and credit schemes tailored for your growth.</p>
        </div>

        <div className="finance-content-grid">

          {/* LEFT: Eligibility Checker Card */}
          <div className="eligibility-card">
            <div className="decorative-circle"></div>
            
            <h2 className="eligibility-title">✅ Loan Eligibility</h2>
            <p className="eligibility-desc">Check how much agricultural loan you can avail instantly based on your annual farm income.</p>
            
            <form onSubmit={checkEligibility}>
              <div className="input-group">
                <label>Annual Farm Income (₹)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 200000" 
                  value={income} 
                  onChange={(e) => setIncome(e.target.value)}
                />
              </div>
              <button type="submit" className="check-btn">Check Eligibility</button>
            </form>

            {loanAmount && (
              <div className="loan-result">
                <p>You are eligible for upto</p>
                <h2>₹ {loanAmount}</h2>
              </div>
            )}
          </div>

          {/* RIGHT: Govt Schemes */}
          <div className="schemes-section">
            <h2 className="schemes-title">🏛️ Government Schemes</h2>
            <div className="schemes-list">
              {schemes.map((scheme) => (
                <div key={scheme.id} className="scheme-card">
                  <div className="scheme-header">
                    <h3>{scheme.title}</h3>
                    <span className="scheme-type">{scheme.type}</span>
                  </div>
                  <p className="scheme-desc">{scheme.desc}</p>
                  <div className="scheme-footer">
                    <div className="scheme-interest">
                        <span>Interest:</span>
                        <strong>{scheme.interest}</strong>
                    </div>
                    <button className="view-btn">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Finance;