import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentLogin.css";

function StudentLogin() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login Successful");

        if (data.role === "admin") {
          navigate("/admin");
        } else if (data.role === "teacher") {
          navigate("/teacher");
        } else if (data.role === "student") {
          navigate("/student");
        }

      } else {
        alert(data.error);
      }

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="sl-page">
      <div className="sl-panel">

        <div className="sl-header">
          <span className="sl-logo">📘</span>
          <span className="sl-title">Digital Test and Evaluation Portal</span>
        </div>

        <h3 className="sl-subtitle">Student Login</h3>

        <input
          type="text"
          placeholder="Email or Roll Number"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <p className="forgot">Forgot Password?</p>

        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}

export default StudentLogin;