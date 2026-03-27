import React, { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import "../styles/EquipmentRental.css";

const EquipmentRental = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("rentee"); // Default = Rentee

  const fetchEquipment = useCallback(async () => {
    setLoading(true);

    try {
      // If lessee → fetch my equipment
      // If rentee → fetch all equipment
      const url =
        mode === "lessee"
          ? "/api/equipment/my-equipment"
          : "/api/equipment";

      const res = await api.get(url);
      setEquipment(res.data);
    } catch (err) {
      console.log("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [mode]);

  useEffect(() => {
    fetchEquipment();
  }, [fetchEquipment]);

  return (
    <>
      <Navbar />

      <div className="rental-page-container">

        {/* MODE SWITCH */}
        <div className="switch-container">
          <div className="switch-tabs">
            <button
              className={`switch-tab ${mode === "lessee" ? "active" : ""}`}
              onClick={() => setMode("lessee")}
            >
              <span className="switch-icon">🚜</span> Lessee
            </button>

            <button
              className={`switch-tab ${mode === "rentee" ? "active" : ""}`}
              onClick={() => setMode("rentee")}
            >
              <span className="switch-icon">🛒</span> Rentee
            </button>

            <div className={`switch-slider ${mode}`}></div>
          </div>
        </div>

        {/* HEADER */}
        <div className="rental-header">
          <h1>
            {mode === "lessee"
              ? "Your Equipment Listings"
              : "Available Equipment"}
          </h1>

          {/* SEPARATE PAGE LINK */}
          {mode === "lessee" && (
            <a href="/services/rental/add" className="add-rental-link">
              + Add New Equipment
            </a>
          )}
        </div>

        {/* EQUIPMENT GRID */}
        {loading ? (
          <h2 className="loading-text">Loading equipment...</h2>
        ) : (
          <div className="equipment-grid">
            {equipment.length > 0 ? (
              equipment.map((item) => (
                <div key={item._id} className="equipment-card">

                  <img
                    src={
                      item.imageUrl ||
                      "https://via.placeholder.com/300x200?text=No+Image"
                    }
                    alt={item.name}
                    className="equipment-image"
                  />

                  <div className="card-content">
                    <h3 className="equipment-name">{item.name}</h3>

                    <p className="equip-loc-text">
                      📍 {item.location} ({item.type})
                    </p>

                    <div className="card-footer">
                      <h2 className="price-text">
                        ₹{item.pricePerHour}
                        <span className="per-hour">/hr</span>
                      </h2>

                      {mode === "rentee" && (
                        <button className="book-btn">
                          Book Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data-msg">
                {mode === "lessee"
                  ? "You haven't added equipment yet."
                  : "No equipment available right now."}
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default EquipmentRental;