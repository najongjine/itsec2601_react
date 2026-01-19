import { useState } from "react";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <h1>Register</h1>

      <div>
        <label>username:</label>
        <input
          value={username}
          onKeyDown={(e) => {
            if (e.code.toLowerCase().includes("enter")) {
            }
          }}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
      </div>
      <div>
        <label>password:</label>
        <input
          value={password}
          onKeyDown={(e) => {
            if (e.code.toLowerCase().includes("enter")) {
            }
          }}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </div>
      <div>
        <button onClick={() => {}}>Register</button>
      </div>
    </div>
  );
}

export default Register;
