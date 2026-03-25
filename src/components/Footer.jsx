import React from "react";
import "../styles/Footer.css";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="footer-wrapper">

      <div className="footer-content">

        {/* Left side */}
        <div className="footer-left">
          <div className="footer-logo">AGRI<span>TECH</span></div>

          <p className="footer-desc">
            Supporting farmers with smart soil insights, crop recommendations,
            and AI tools that improve productivity and sustainability.
          </p>

          <div className="footer-socials">
            <FaXTwitter />
            <FaLinkedinIn />
            <FaInstagram />
            <FaFacebookF />
          </div>

          <button className="back-to-top" onClick={() =>
            window.scrollTo({ top: 0, behavior: "smooth" })
          }>
            ↑ BACK TO TOP
          </button>
        </div>

        {/* Sitemap */}
        <div className="footer-col">
          <h4 className="footer-heading">Site Map</h4>
          <ul>
            <li onClick={() => navigate('/Overview')}>Overview</li>
            <li onClick={() => navigate('/Dashboard')}>Dashboard</li>
            {/* <li onClick={() => navigate('/Services')}>Services</li> */}
            <Link to="/Services" style={{ textDecoration: "none", color: "inherit" }}>
              <li>Services</li>
            </Link>
            <li onClick={() => navigate('learn')}>Learning Hub</li>
            <li onClick={() => navigate('Insights')}>Farming Insights</li>
          </ul>
        </div>

        {/* Legal */}
        <div className="footer-col">
          <h4 className="footer-heading">Legal</h4>
          <ul>
            <li>Privacy Policy</li>
            <li>Terms of Services</li>
            <li>Report Issue</li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        © 2026 Agritech. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;
