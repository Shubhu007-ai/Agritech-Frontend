import React, { useState } from 'react';
import api from "../api/axios";
import '../styles/AddCropForm.css';

const AddCropForm = ({ onCropAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Vegetable',
    pricePerKg: '',
    quantity: '',
    location: '',
    sellerName: '',
    imageUrl: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/crops', formData);
      alert('Crop Listed Successfully!');
      setFormData({ name: '', type: 'Vegetable', pricePerKg: '', quantity: '', location: '', sellerName: '', imageUrl: '' });
      if (onCropAdded) onCropAdded();
    } catch (error) {
      console.error("Error adding crop:", error);
      alert("Failed to list crop.");
    }
  };

  return (
    <div className="crop-form-container">
      <h3>🥬 Sell Your Product</h3>
      <form onSubmit={handleSubmit} className="crop-form">
        <input name="name" placeholder="Crop Name (e.g. Red Onions)" value={formData.name} onChange={handleChange} required className="crop-input" />
        
        <select name="type" value={formData.type} onChange={handleChange} className="crop-input">
          <option value="Vegetable">Vegetable</option>
          <option value="Fruit">Fruit</option>
          <option value="Grain">Grain</option>
          <option value="Pulse">Pulse/Dal</option>
        </select>

        <input type="number" name="pricePerKg" placeholder="Price per Kg (₹)" value={formData.pricePerKg} onChange={handleChange} required className="crop-input" />
        <input type="number" name="quantity" placeholder="Available Quantity (kg)" value={formData.quantity} onChange={handleChange} required className="crop-input" />
        
        <input name="location" placeholder="Farm Location" value={formData.location} onChange={handleChange} required className="crop-input" />
        <input name="sellerName" placeholder="Your Name" value={formData.sellerName} onChange={handleChange} required className="crop-input" />
        
        <input name="imageUrl" placeholder="Image URL" value={formData.imageUrl} onChange={handleChange} required className="crop-input full-width" />

        <button type="submit" className="sell-btn">List Produce for Sale</button>
      </form>
    </div>
  );
};

export default AddCropForm;