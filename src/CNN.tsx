import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import "./CNN.css";
import Ballpit from "./Component/reactbits/Ballpit";

function CNN() {
  const CNN_API_URL = import.meta.env.VITE_CNN_API_URL;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const model = searchParams.get("model");

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  }, [model]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null); // Reset result on new file selection
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file || !model) {
      setError("Please select a file and a model.");
      return;
    }

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${CNN_API_URL}/${model}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setResult(data);
      } else {
        setError(data?.msg || "Classification failed.");
      }
    } catch (err: any) {
      console.error("Error uploading file:", err?.message);
      setError(err?.message || "An error occurred while uploading the file.");
    } finally {
      setLoading(false);
    }
  };

  const handleExampleSelect = async (imagePath: string) => {
    try {
      const response = await fetch(imagePath);
      const blob = await response.blob();
      const filename = imagePath.split("/").pop() || "example.png";
      const file = new File([blob], filename, { type: blob.type });

      setFile(file);
      setPreview(imagePath); // Use the original path for preview
      setResult(null);
      setError(null);
    } catch (err) {
      console.error("Error loading example image:", err);
      setError("Failed to load example image.");
    }
  };

  return (
    <div className="cnn-container">
      <h1>CNN Model: {model || "Select a model"}</h1>

      {model === "classify_muffin_chihuahua" && (
        <p>Chihuahua vs Muffin Classification</p>
      )}
      {(model === "classify_muffin_chihuahua_fgsm" ||
        model === "classify_muffin_chihuahua") && (
        <>
          <p>Chihuahua vs Muffin Adversarial Defense</p>
          <div className="example-images-container">
            <div onClick={() => handleExampleSelect("muffin1.png")}>
              <p>Original</p>
              <img
                src="/muffin1.png"
                alt="Original Muffin"
                className="example-image"
              />
            </div>
            <div
              onClick={() =>
                handleExampleSelect("FGSMattack_muffin_eps_0_10.png")
              }
            >
              <p>Adversarial (FGSM)</p>
              <img
                src="/FGSMattack_muffin_eps_0_10.png"
                alt="Adversarial Muffin"
                className="example-image"
              />
            </div>
          </div>
        </>
      )}
      {model === "classify_plant_disease" && (
        <p>Wheat Disease Classification</p>
      )}
      {model === "classify_bee_wasp" && <p>Bee vs Wasp Classification</p>}

      {model && (
        <div className="upload-section">
          <input type="file" accept="image/*" onChange={handleFileChange} />

          {preview && (
            <div className="preview-container">
              <img src={preview} alt="Preview" className="preview-image" />
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="classify-button"
          >
            {loading ? "Classifying..." : "Classify Image"}
          </button>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {result && result.predictions && (
        <div className="results-container">
          <h2>Classification Results</h2>
          <table className="results-table">
            <thead>
              <tr className="table-header-row">
                <th className="table-header-cell">Rank</th>
                <th className="table-header-cell">Class Name</th>
                <th className="table-header-cell">Probability</th>
              </tr>
            </thead>
            <tbody>
              {result.predictions.map((pred: any) => (
                <tr key={pred.rank} className="table-row">
                  <td className="table-cell">{pred.rank}</td>
                  <td className="table-cell">{pred.class_name}</td>
                  <td className="table-cell">
                    {(parseFloat(pred.probability) * 100).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CNN;
