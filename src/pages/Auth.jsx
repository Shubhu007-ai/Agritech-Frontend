import { useState } from "react";
// import { useParams } from "react-router-dom";

import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import ForgotPassword from "../components/auth/ForgotPassword";
import VerifyOtp from "../components/auth/VerifyOtp";
import ResetPassword from "../components/auth/ResetPassword";
import SetPassword from "../components/auth/SetPassword";

import "../styles/Auth.css";

export default function Auth() {
  const [mode, setMode] = useState("login");
  const [emailForOtp, setEmailForOtp] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [googleEmail, setGoogleEmail] = useState("");

  return (
    <div className="auth-container">
      {mode === "login" && (
        <LoginForm
          goRegister={() => setMode("register")}
          goForgot={() => setMode("forgot")}
          goSetPassword={(email) => {
            setGoogleEmail(email);
            setMode("setPassword");
          }}
        />
      )}

      {mode === "setPassword" && (
  <SetPassword
    email={googleEmail}
    goLogin={() => setMode("login")}
  />
)}

      {mode === "register" && (
        <RegisterForm
          goLogin={() => setMode("login")}
          goVerify={(email) => {
            setEmailForOtp(email);
            setMode("verifyOtp");
          }}
        />
      )}

      {mode === "verifyOtp" && (
        <VerifyOtp email={emailForOtp} goLogin={() => setMode("login")} />
      )}

      {mode === "forgot" && (
        <ForgotPassword
          goLogin={() => setMode("login")}
          goReset={(email) => {
            setResetEmail(email);
            setMode("resetPassword");
          }}
        />
      )}

      {mode === "resetPassword" && (
        <ResetPassword email={resetEmail} goLogin={() => setMode("login")} />
      )}
    </div>
  );
}
