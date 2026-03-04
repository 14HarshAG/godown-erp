import React, { useState } from "react";
import axios from "axios";
import "../App.css";
import { useNavigate } from "react-router-dom";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {

      const response = await axios.post(
        "https://localhost:7289/api/Auth/login",
        {
          email: email,
          password: password,
        }
      );

      const token = response.data.token;

      if (token) {
        localStorage.setItem("token", token);
        setMessage("Login Successful ✅");
        navigate("/dashboard");
      }

    } catch (error) {

      if (error.response) {
        setMessage("Invalid Credentials ❌");
      } else {
        setMessage("Server not reachable ❌");
      }

    }
  };

  return (

    <div className="login-wrapper">

      {/* LEFT SIDE DESIGN */}

      <div className="login-left">

        <div className="login-left-content">
          <h2>Welcome to Godown ERP</h2>

          <p>
            Manage your vendors, products and inventory
            with a modern ERP dashboard.
          </p>

        </div>

      </div>


      {/* RIGHT SIDE LOGIN FORM */}

      <div className="login-right">

        <div className="login-card">

          <h2 className="login-title">Login to your account</h2>

          <p className="login-subtitle">
            Enter your credentials to access the dashboard
          </p>
          <div className="input-group">
            <span className="input-icon">📧</span>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="input-group">
            <span className="input-icon">🔒</span>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />
          </div>

          <button
            onClick={handleLogin}
            className="login-btn"
          >
            Login
          </button>

          <p className="message">{message}</p>

        </div>

      </div>

    </div>

  );

}

export default Login;