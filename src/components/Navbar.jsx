import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import "../styles/Navbar.css";
import Logo from "../assets/logo.jsx";
import ThemeToggle from "./ThemeToggle";  

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isOverview = location.pathname === "/";
  const token = localStorage.getItem("token");

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsOpen(false); // Closes sidebar on logout
    window.location.href = "/";
  };

  const handleDashboardClick = (e) => {
    if (!token) {
      e.preventDefault();
      navigate("/auth");
    }
    setIsOpen(false);
  };

  const handleServicesClick = (e) => {
    if (!token) {
      e.preventDefault();
      navigate("/auth");
    }
    setIsOpen(false);
  };

  // Helper function to render buttons once
  const renderAuthButtons = () => (
    <>
      {!token ? (
        <>
          <Link to="/auth" className="get-started-btn" onClick={() => setIsOpen(false)}>Login/Register</Link>
        </>
      ) : (
        <button className="logout-btn header-logout get-started-btn" onClick={handleLogout}>
          Logout
        </button>
      )}
    </>
  );

  return (
    <nav className={`navbar ${isOverview ? "navbar-overview" : ""}`}>
      <div className="nav-brand">
        <Logo />
      </div>

      {/* Hamburger Icon on the left (via order CSS) */}
      <div className={`hamburger ${isOpen ? "active" : ""}`} onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

      {/* 75% Width Side Menu */}
      <div className={`nav-menu ${isOpen ? "open" : ""}`}>
        <Link to="/" className={isOverview ? "nav-link active" : "nav-link"} onClick={() => setIsOpen(false)}>
          Overview
        </Link>
        <Link
          to="/dashboard"
          onClick={handleDashboardClick}
          className={location.pathname === "/dashboard" ? "nav-link active" : "nav-link"}
        >
          Dashboard
        </Link>
        <Link
          to="/services"
          className={location.pathname === "/services" ? "nav-link active" : "nav-link"}
          onClick={handleServicesClick}
        >
          Services
        </Link>

          <Link
          to="/learn"
          className={location.pathname === "/learn" ? "nav-link active" : "nav-link"}
          onClick={handleServicesClick}
        >
          Learning Hub
        </Link>

        <Link
          to="/insights"
          className={location.pathname === "/insights" ? "nav-link active" : "nav-link"}
          onClick={handleServicesClick}
        >
          Farming Insights
        </Link>

        <div className="nav-actions-mobile">
          <ThemeToggle />
          {renderAuthButtons()}
        </div>
      </div>

        

      {/* Standard Action buttons for Desktop */}
      <div className="nav-actions">
        <ThemeToggle />
        {renderAuthButtons()}
      </div>
       
    </nav>
  );
};

export default Navbar;