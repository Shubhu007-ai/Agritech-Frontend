import { useState } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { FaEye, FaEyeSlash } from "react-icons/fa";
export default function LoginForm({ goRegister, goForgot, goSetPassword }) {
  const [identifier, setIdentifier] = useState(""); // phone OR email
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  const API = import.meta.env.VITE_API_BASE_URL;
  /* =========================
     LOGIN (PHONE OR EMAIL)
  ========================= */

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!identifier || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${API}/auth/login`, {
        identifier,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      window.location.href = "/dashboard";
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     GOOGLE LOGIN
  ========================= */
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await axios.post(`${API}/auth/google-login`, {
        token: credentialResponse.credential,
      });

      if (res.data.needPasswordSetup) {
        goSetPassword(res.data.email);
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      alert("Google login failed");
    }
  };

  return (
    <div className="auth-box">
      <h2 className="auth-title">Login</h2>

      {/* =========================
          LOGIN FORM
      ========================= */}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Enter phone or email"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value.trim())}
          className="auth-input"
        />

        <div className="login-input-group">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
          />

          <span
            className="eye-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* =========================
          DIVIDER
      ========================= */}
      <div className="divider">
        <span>OR</span>
      </div>

      {/* =========================
          GOOGLE LOGIN
      ========================= */}
      <div className="google-login">
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => alert("Google Login Failed")}
          theme="outline"
          shape="rectangular"
          text="signin_with"
          size="large"
        />
      </div>

      {/* =========================
          LINKS
      ========================= */}
      <p className="auth-link" onClick={goForgot}>
        Forgot Password?
      </p>

      <p className="auth-link">
        Don't have an account? <span onClick={goRegister}>Register</span>
      </p>
    </div>
  );
}
