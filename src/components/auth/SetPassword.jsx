import { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function SetPassword({ email, goLogin }) {

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const API = import.meta.env.VITE_API_BASE_URL;
  /* =========================
     PASSWORD STRENGTH
  ========================= */
  const getStrength = () => {
    if (password.length < 6) return "Weak";
    if (password.match(/^(?=.*[A-Z])(?=.*\d).{6,}$/)) return "Strong";
    return "Medium";
  };

  const strength = getStrength();

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async () => {

    setError("");

    if (!password || !confirm) {
      setError("Please fill all fields");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {

      setLoading(true);

      const res = await axios.post(`${API}/auth/set-password`, {
        email,
        password
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setSuccess(true);

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="auth-box">

      <h2 className="auth-title">Set Password</h2>

      {/* ERROR */}
      {error && <div className="auth-error">{error}</div>}

      {/* SUCCESS */}
      {success && <div className="auth-success">Password set successfully 🎉</div>}

      {/* PASSWORD */}
      <div className="setpass-input-group">
        <input
          type={showPass ? "text" : "password"}
          placeholder="Create Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          className="auth-input"
        />
        <span onClick={() => setShowPass(!showPass)} className="eye-btn">
          {showPass ?  <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      {/* STRENGTH */}
      <div className={`strength ${strength.toLowerCase()}`}>
        Strength: {strength}
      </div>

      {/* CONFIRM */}
      <div className="setpass-input-group">
        <input
          type={showConfirm ? "text" : "password"}
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e)=>setConfirm(e.target.value)}
          className="auth-input"
        />
        <span onClick={() => setShowConfirm(!showConfirm)} className="eye-btn">
          {showConfirm ?  <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      <button
        className="auth-btn"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Password"}
      </button>

      <p className="auth-link" onClick={goLogin}>
        Back to Login
      </p>

    </div>
  );
}