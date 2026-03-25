import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Testimonials from "../components/Testimonial";

import '../styles/Overview.css';

const Overview = () => {
    const navigate = useNavigate();

    return (
        <>
        <div className="overview-container">
            <Navbar />

            <main className="overview-content">
                <section className="hero-section">
                    <h1>Smarter farming, from weather to market signals.</h1>
                    <p className="hero-text">
                        A single place to view alerts, forecast trends, crop advisories, soil health guidance,
                        and pricing insights — designed to work great on mobile.
                    </p>

                    <div className="hero-cta">
                        <button
                            className="btn-open-dash"
                            onClick={() => {
                                // Check if the user is logged in (e.g., token exists in localStorage)
                                const isLoggedIn = localStorage.getItem('token');

                                if (isLoggedIn) {
                                    navigate('/dashboard');
                                } else {
                                    navigate('/auth');
                                }
                            }}
                        >
                            Open dashboard →
                        </button>
                        <button className="btn-view-schemes">View schemes</button>
                    </div>

                    <div className="feature-cards-row">
                        <div className="feature-mini-card">
                            <span className="f-icon">🌤️</span>
                            <div>
                                <h4>Weather & alerts</h4>
                                <p>Forecast blocks and rainfall probability.</p>
                            </div>
                        </div>
                        <div className="feature-mini-card">
                            <span className="f-icon">🌱</span>
                            <div>
                                <h4>Crop advisory</h4>
                                <p>Stage-based suggestions for your region.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <aside className="quick-stats-panel">
                    <div className="status-card">
                        <div className="card-top">
                            <h3>Today's overview</h3>
                            <span className="loc-tag">Delhi, IN</span>
                        </div>
                        <div className="stat-line"><span>Rain chance</span><strong>35%</strong></div>
                        <div className="stat-line"><span>Soil moisture</span><strong>Moderate</strong></div>
                        <div className="stat-line"><span>Market signal</span><strong>Upward</strong></div>

                        <div className="next-box">
                            <span className="next-label">NEXT</span>
                            <p>Explore Dashboard, Advisory, and Market Prices.</p>
                        </div>
                    </div>
                </aside>
                 
            </main>
            <Testimonials /> 
        </div>
        <Footer />
        </>
    );
};

export default Overview;