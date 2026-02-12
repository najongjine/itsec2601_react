import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import "./CNN.css";
import Ballpit from "./Component/reactbits/Ballpit";

function CNN() {
  const CNN_API_URL = import.meta.env.VITE_CNN_API_URL;
  const navigate = useNavigate();

  return (
    <div>
      <h1>CNN</h1>
    </div>
  );
}

export default CNN;
