import { useState, useEffect, useRef } from "react";
import api from "../../api/axios";

export default function VerifyOtp({ email, goLogin }) {

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(300);

  const inputs = useRef([]);

  /* Countdown */

  useEffect(() => {

    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);

  }, [timer]);

  /* Handle OTP Input */

  const handleChange = (value, index) => {

    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }

  };

  const handleKeyDown = (e, index) => {

    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }

  };

  /* Verify OTP */

  const handleVerify = async () => {

    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      alert("Enter complete OTP");
      return;
    }

    try {

      setLoading(true);

      await api.post(
        "/auth/verify-otp",
        {
          email,
          otp: finalOtp
        }
      );

      alert("Email verified successfully");

      goLogin();

    } catch (err) {

      alert(err.response?.data?.message || "OTP verification failed");

    } finally {

      setLoading(false);

    }

  };

  /* Resend OTP */

  const handleResend = async () => {

    try {

      const res = await api.post(
        "/auth/resend-otp",
        { email }
      );

      const remaining =
        Math.floor((new Date(res.data.resendAfter) - new Date()) / 1000);

      setTimer(remaining);

      alert("New OTP sent");

    } catch (err) {

      alert(err.response?.data?.message);

    }

  };

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  return (

    <div className="auth-box">

      <h2 className="auth-title">Verify Email</h2>

      <p className="auth-subtext">
        Enter the OTP sent to your email
      </p>

      {/* OTP INPUT BOXES */}

      <div className="otp-container">

        {otp.map((digit, index) => (

          <input
            key={index}
            type="text"
            maxLength="1"
            value={digit}
            ref={(el) => (inputs.current[index] = el)}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="otp-input"
          />

        ))}

      </div>

      <button
        className="auth-btn"
        onClick={handleVerify}
        disabled={loading}
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>

      <p className="auth-subtext">

        {timer > 0
          ? `Resend OTP in ${minutes}:${seconds
              .toString()
              .padStart(2, "0")}`
          : "You can resend OTP now"}

      </p>

      <button
        className="auth-btn"
        onClick={handleResend}
        disabled={timer > 0}
      >
        Resend OTP
      </button>

      <p className="auth-link" onClick={goLogin}>
        Back to Login
      </p>

    </div>

  );

}