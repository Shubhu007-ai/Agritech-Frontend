import React, { useState, useEffect, useCallback } from 'react';
import api from "../api/axios";
import Navbar from '../components/Navbar';
import AddCropForm from '../components/AddCropForm';
import '../styles/Marketplace.css';

const Marketplace = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // 1. Define Fetch Function with useCallback
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

  // 2. Initial Load
  useEffect(() => {
    fetchCrops();
  }, [fetchCrops]);

  return (
    <>
      <Navbar />
      <div className="market-container">
        
        <div className="market-header">
          <h1>🥦 Direct-to-Consumer Market</h1>
          <p>Buy fresh produce directly from farmers. No middlemen.</p>
          
          <button className="toggle-sell-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Close Form' : '+ Sell Your Produce'}
          </button>
        </div>

        {showForm && (
          <AddCropForm onCropAdded={fetchCrops} />
        )}

        {loading ? (
          <h2 style={{textAlign: 'center'}}>Loading fresh produce...</h2>
        ) : (
          <div className="market-grid">
            {crops.length > 0 ? (
              crops.map((crop) => (
                <div key={crop._id} className="crop-card">
                  <img src={crop.imageUrl} alt={crop.name} className="crop-image" />
                  
                  <div className="crop-details">
                    <div style={{display:'flex', justifyContent:'space-between'}}>
                      <span className="crop-tag">{crop.type}</span>
                      <span style={{fontSize:'0.85rem', color:'#666'}}>📍 {crop.location}</span>
                    </div>
                    
                    <h3 style={{margin: '10px 0', color: '#333'}}>{crop.name}</h3>
                    <p style={{color: '#555', fontSize: '0.9rem'}}>Farmer: {crop.sellerName}</p>
                    <p style={{color: '#555', fontSize: '0.9rem'}}>Stock: {crop.quantity} kg</p>

                    <div className="price-row">
                      <span className="crop-price">₹{crop.pricePerKg}<small style={{fontSize:'12px', color:'#666'}}>/kg</small></span>
                      <button className="buy-btn" onClick={() => alert(`Buying ${crop.name} from ${crop.sellerName}`)}>
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{textAlign: 'center', width: '100%'}}>No produce listed yet. Be the first!</p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Marketplace;