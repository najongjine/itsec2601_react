import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./FaceRecog.css";

function FaceRecog() {
  const FaceRecog_API_URL = import.meta.env.VITE_FACERECOG_API_URL;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {}, []);

  return (
    <div>
      <h1>FaceRecog</h1>
    </div>
  );
}

export default FaceRecog;
