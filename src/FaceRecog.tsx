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

  async function handleUpload(event: React.MouseEvent<HTMLButtonElement>) {
    if (!file) {
      alert("이미지를 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch(FaceRecog_API_URL, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        alert(`Network response was not ok ${response.status}`);
        return;
      }
      const data = await response.json();
      console.log(data);
    } catch (error: any) {
      alert(`Error: ${error?.message}`);
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  }

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
