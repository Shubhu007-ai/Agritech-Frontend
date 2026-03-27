import React, { useState } from "react";
// import axios from "axios";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import "../styles/AddEquipmentPage.css";

const AddEquipmentPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    type: "Tractor",
    pricePerHour: "",
    location: "",
    imageUrl: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/api/equipment", { ...formData });

      alert("Equipment Listed Successfully!");

      setFormData({
        name: "",
        type: "Tractor",
        pricePerHour: "",
        location: "",
        imageUrl: "",
      });

    } catch (error) {
      console.error("Error adding equipment:", error);
      alert("Failed to list equipment");
    }
  };

  return (
    <>
      <Navbar />

      <div className="add-equipment-wrapper">
        <div className="add-equipment-card">
          <h1 className="add-equipment-title">Add New Equipment</h1>
          <p className="add-equipment-sub">
            Fill in the details below to list your machine.
          </p>

          <form onSubmit={handleSubmit} className="equipment-form">

            <input
              type="text"
              name="name"
              placeholder="Machine Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input"
            />

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="equipment-type"
            >
              <option value="Tractor">Tractor</option>
              <option value="Drone">Drone</option>
              <option value="Harvester">Harvester</option>
              <option value="Tiller">Power Tiller</option>
            </select>

            <input
              type="text"
              name="location"
              placeholder="Location (e.g. Pune, MH)"
              value={formData.location}
              onChange={handleChange}
              required
              className="form-input"
            />

            <input
              type="number"
              name="pricePerHour"
              placeholder="Price per Hour (₹)"
              value={formData.pricePerHour}
              onChange={handleChange}
              required
              className="form-input"
            />

            <input
              type="text"
              name="imageUrl"
              placeholder="Image URL"
              value={formData.imageUrl}
              onChange={handleChange}
              required
              className="form-input full-width"
            />

            <button type="submit" className="add-equip-btn">
              List Equipment Now
            </button>

          </form>
        </div>
      </div>
    </>
  );
};

export default AddEquipmentPage;