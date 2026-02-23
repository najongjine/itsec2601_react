import { useState, useEffect, ChangeEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./FaceRecog.css";

function FaceRecog() {
  const FaceRecog_API_URL = import.meta.env.VITE_FACERECOG_API_URL;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {}, []);

  function handleUpload(event: React.MouseEvent<HTMLButtonElement>): void {}

  function handleFileChange(event: ChangeEvent<HTMLInputElement>): void {}

  function handlePredict(event: React.MouseEvent<HTMLButtonElement>): void {}

  return (
    <div>
      <h1>FaceRecog</h1>

      <input type="file" accept="image/*" onChange={handleFileChange} />

      {preview && (
        <div className="preview-container">
          <img src={preview} alt="Preview" className="preview-image" />
        </div>
      )}

      <button onClick={handleUpload} className="classify-button">
        Classify Image
      </button>

      <button onClick={handlePredict}></button>
    </div>
  );
}

export default FaceRecog;
