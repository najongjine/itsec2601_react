import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Register() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const response = await fetch(`${API_BASE_URL}/api/user/register`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data);

      if (data.success) {
        alert("Registration successful! \nUser ID: " + data.data.userInfo.id);
        // Optional: Redirect or clear form here
        setUsername("");
        setPassword("");
        navigate("/");
      } else {
        alert("Registration failed: " + (data.msg || "Unknown error"));
      }
    } catch (error) {
      console.error("Error registering:", error);
      alert("An error occurred during registration.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleRegister();
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1 className="login-title">회원가입</h1>

        <div className="form-group">
          <label className="form-label">Username</label>
          <input
            className="login-input"
            value={username}
            onKeyDown={handleKeyDown}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="login-input"
            value={password}
            onKeyDown={handleKeyDown}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Choose a password"
          />
        </div>
        <div>
          <button className="login-button" onClick={handleRegister}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
