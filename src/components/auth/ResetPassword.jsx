import { useState } from "react";
import axios from "axios";

export default function ResetPassword({ email, goLogin }) {

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const API = import.meta.env.VITE_API_BASE_URL;
  const handleReset = async () => {

    if (!otp || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {

      setLoading(true);

      await axios.post(
        `${API}/auth/reset-password`,
        {
          email,
          otp,
          password
        }
      );

      alert("Password updated successfully");
      goLogin();

    } catch (err) {

      alert(err.response?.data?.message || "Reset failed");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="auth-box">

      <h2 className="auth-title">Reset Password</h2>

      <p className="auth-subtext">
        Enter OTP and new password
      </p>

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e)=>setOtp(e.target.value.trim())}
        className="auth-input"
      />

      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        className="auth-input"
      />

      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e)=>setConfirmPassword(e.target.value)}
        className="auth-input"
      />

      <button
        className="auth-btn"
        onClick={handleReset}
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Password"}
      </button>

      <p className="auth-link" onClick={goLogin}>
        Back to Login
      </p>

    </div>

  );
}