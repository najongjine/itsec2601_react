import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

function Login() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  /** 앱은, 화면끼리 데이터 공유를 못해요.
   * login 페이지에서 token을 받고, Calc 같은 페이지로 이동하면,
   * 서버에서 받았던 정보 싹 날라가요
   * 이걸 고치려면 페이지끼리 데이터를 공유할 수 있는 방법을 찾아야 해요.
   1. query string : 주소창에 데이터 붙이는건데, 이건 정보보안법에 걸려요
   2. Context API : 이건 공용 저장소를 쉽게 안보이는곳에 저장해서 공유하는 방법이에요
   */
  const handleRegister = async () => {
    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const response = await fetch(`${API_BASE_URL}/api/user/login`, {
        method: "POST",
        body: formData,
      });

      let data = await response.json();
      console.log(data);

      if (data.success) {
        data = data?.data;
        // alert("login successful! \nUser ID: " + data.userInfo.id);

        // Store in context
        login(data?.userInfo, data?.token);

        // Optional: Redirect or clear form here
        setUsername("");
        setPassword("");
        navigate("/");
      } else {
        alert("login failed: " + (data.msg || "Unknown error"));
      }
    } catch (error) {
      console.error("Error login:", error);
      alert("An error occurred during login.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleRegister();
    }
  };

  return (
    <div>
      <h1>Login</h1>

      <div>
        <label>username:</label>
        <input
          value={username}
          onKeyDown={handleKeyDown}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
      </div>
      <div>
        <label>password:</label>
        <input
          type="password"
          value={password}
          onKeyDown={handleKeyDown}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </div>
      <div>
        <button onClick={handleRegister}>Login</button>
      </div>
    </div>
  );
}

export default Login;
