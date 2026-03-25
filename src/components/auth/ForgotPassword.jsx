import { useState } from "react";
import axios from "axios";

export default function ForgotPassword({ goLogin, goReset }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const API = import.meta.env.VITE_API_BASE_URL;

  const handleSendLink = async () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${API}/auth/forgot-password`, { email });

      alert("OTP sent to your email");
      goReset(email);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-box">
      <h2 className="auth-title">Forgot Password</h2>

      <p className="auth-subtext">Enter your email to receive a reset link</p>

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="auth-input"
      />

      <button className="auth-btn" onClick={handleSendLink} disabled={loading}>
        {loading ? "Sending..." : "Send Reset Link"}
      </button>

      <p className="auth-link" onClick={goLogin}>
        Back to Login
      </p>
    </div>
  );
}
