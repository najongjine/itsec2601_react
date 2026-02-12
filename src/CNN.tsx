import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import "./CNN.css";
import Ballpit from "./Component/reactbits/Ballpit";

function CNN() {
  const CNN_API_URL = import.meta.env.VITE_CNN_API_URL;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const model = searchParams.get("model");

  return (
    <div style={{ padding: "2rem" }}>
      <h1>CNN Model: {model || "Select a model"}</h1>
      {model === "classify_muffin_chihuahua" && (
        <p>Chihuahua vs Muffin Classification</p>
      )}
      {model === "classify_muffin_chihuahua_fgsm" && (
        <p>Chihuahua vs Muffin Adversarial Defense</p>
      )}
      {model === "classify_plant_disease" && (
        <p>Wheat Disease Classification</p>
      )}
      {model === "classify_bee_wasp" && <p>Bee vs Wasp Classification</p>}
    </div>
  );
}

export default CNN;
