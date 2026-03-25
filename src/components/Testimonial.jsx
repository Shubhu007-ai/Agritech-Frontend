import React from "react";
import "../styles/Testimonial.css";

const testimonials = [
  {
    name: "Ramesh Yadav",
    location: "Kanpur, UP",
    text: "Rain alerts helped me protect my wheat crop during sudden storms.",
    img: "images/Farmer1.jpeg"
  },
  {
    name: "Arjun Singh",
    location: "Jaipur, RJ",
    text: "The advisory feature improved my fertilizer planning this season.",
    img: "https://www.shutterstock.com/image-photo/indian-farmer-harvesting-paddy-happy-260nw-2510944615.jpg"
  }
];

const Testimonials = () => {
  return (
    <div className="testimonial-section">

      {testimonials.map((item, index) => (
        <div
          className={`testimonial-card ${index % 2 === 0 ? "left" : "right"}`}
          key={index}
        >
          {/* Image */}
          <div className="testimonial-image">
            <img src={item.img} alt={item.name} />
          </div>

          {/* Text */}
          <div className="testimonial-details">
            <h3>{item.name}</h3>
            <p className="location">{item.location}</p>
            <p className="text">{item.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Testimonials;
