import React, { useState, useEffect, useCallback } from 'react';
import api from "../api/axios";
import Navbar from '../components/Navbar';
import AddCropForm from '../components/AddCropForm';
import '../styles/Marketplace.css';

const Marketplace = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchCrops = useCallback(async () => {
    try {
      const res = await api.get('/crops');
      setCrops(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching crops:", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCrops();
  }, [fetchCrops]);

  return (
    <>
      <Navbar />
      <div className="market-container">
        
        <div className="market-header">
          <h1 className="market-title">🥦 Direct-to-Consumer Market</h1>
          <p className="market-subtitle">
            Buy fresh produce directly from farmers. No middlemen.
          </p>

          <button
            className="toggle-sell-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Close Form' : '+ Sell Your Product'}
          </button>
        </div>

        {showForm && (
          <AddCropForm onCropAdded={fetchCrops} />
        )}

        {loading ? (
          <h2 className="market-loading">
            Loading fresh produce...
          </h2>
        ) : (
          <div className="market-grid">
            {crops.length > 0 ? (
              crops.map((crop) => (
                <div key={crop._id} className="crop-card">
                  
                  <img
                    src={crop.imageUrl}
                    alt={crop.name}
                    className="crop-image"
                  />

                  <div className="crop-details">
                    
                    <div className="crop-top-row">
                      <span className="crop-tag">{crop.type}</span>
                      <span className="crop-location">
                        📍 {crop.location}
                      </span>
                    </div>

                    <h3 className="crop-title">{crop.name}</h3>

                    <p className="crop-meta">
                      Farmer: {crop.sellerName}
                    </p>

                    <p className="crop-meta">
                      Stock: {crop.quantity} kg
                    </p>

                    <div className="price-row">
                      <span className="crop-price">
                        ₹{crop.pricePerKg}
                        <small className="price-unit">/kg</small>
                      </span>

                      <button
                        className="buy-btn"
                        onClick={() =>
                          alert(`Buying ${crop.name} from ${crop.sellerName}`)
                        }
                      >
                        Buy Now
                      </button>
                    </div>

                  </div>
                </div>
              ))
            ) : (
              <p className="market-empty">
                No produce listed yet. Be the first!
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Marketplace;