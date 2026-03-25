import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/AgriServices.css';
import { Link } from 'react-router-dom';

const AgriServices = () => {
  return (
    <div className="services-page">
      <Navbar />
      <div className="services-container">
        <header className="services-header">
          <h1>Agri-Services & Ecosystem</h1>
          <p>Comprehensive support tools for every stage of farming.</p>
        </header>

        <div className="services-grid">
          {/* Service Card 1 */}
          <div className="service-card">
            <div className="card-top">
              <span className="icon-box blue">🛡️</span>
              <span className="status-tag verified">Verified</span>
            </div>
            <h3>Agri-Insurance</h3>
            <p>Protect your crops against natural calamities and market volatility.</p>
            <Link to="/services/insurance">
            <button className="explore-link">Explore Service →</button>
            </Link>
          </div>

          {/* Service Card 2 */}
          <div className="service-card">
            <div className="card-top">
              <span className="icon-box green">🚜</span>
              <span className="status-tag available">Available</span>
            </div>
            <h3>Equipment Rental</h3>
            <p>Rent modern tractors, harvesters and drones from verified local owners.</p>
            <Link to="/services/rental">
            <button className="explore-link">Explore Service →</button>
            </Link>
          </div>

          {/* Service Card 3 */}
          <div className="service-card">
            <div className="card-top">
              <span className="icon-box gold">🏛️</span>
              <span className="status-tag apply">Apply Now</span>
            </div>
            <h3>Financial Support</h3>
            <p>Low-interest loans tailored specifically for small-scale farmers.</p>
            <Link to="/services/finance">
            <button className="explore-link">Explore Service →</button>
            </Link>
          </div>
        </div>

        <div className="secondary-services">
          <div className="analytics-card">
             <h3>📈 Farm Profitability Analytics</h3>
             <p>Predict your ROI based on current input costs and expected mandi prices.</p>
             <div className="progress-bar-container">
                <div className="progress-label">Investment Recouped <span>72%</span></div>
                <div className="progress-track"><div className="progress-fill" style={{width: '72%'}}></div></div>
             </div>
          </div>
          <div className="marketplace-card">
             <h3>🛒 Direct-to-Consumer Marketplace</h3>
             <p>Sell your produce directly to urban consumers to bypass middlemen.</p>
             <Link to="/services/marketplace">
             <button className="btn-secondary">Open Shop</button>
              </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgriServices;