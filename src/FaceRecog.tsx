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

  function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>): void {}

  return (
    <div>
      <h1>FaceRecog</h1>

      <input type="file" accept="image/*" onChange={handleFileChange} />

      {preview && (
        <div className="">
          <img src={preview} alt="Preview" className="" />
        </div>
      )}

      <button onClick={handleUpload}>얼굴맞추기</button>
    </div>
  );
}

export default FaceRecog;
