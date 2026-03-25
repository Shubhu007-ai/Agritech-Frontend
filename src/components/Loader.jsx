import "../styles/Loader.css";


const Loader = () => {
  return (
    <div style={{
      textAlign: "center",
      padding: "30px",
      fontSize: "18px",
      color: "#2b7a0b"
    }}>
      <div className="loader-circle"></div>
      <p>Loading...</p>
    </div>
  );
};

export default Loader;
