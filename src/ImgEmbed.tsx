import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./ImgEmbed.css";

/**
 * /api/embedding/search_image
 * 서버에서 주는 데이터 형식 :
{
    "success": true,
    "data": [
        {
            "id": "2",
            "url": "https://i.ibb.co/rSM738g/0244c7d9-2b42-4f90-a663-1cde39e20753.png",
            "title": "0244c7d9-2b42-4f90-a663-1cde39e20753.png",
            "mimetype": "image/png",
            "score": 1
        },
    ]
}
 */

function ImgEmbed() {
  // http://localhost:3000
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") ?? "search_image";

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
  }, [mode]);

  const handleAction = async () => {
    if (!file) {
      setError("이미지를 선택해주세요.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    const isSearch = mode === "search_image";
    const actionName = isSearch ? "검색" : "추가";

    try {
      const response = await fetch(`${API_BASE_URL}/api/embedding/${mode}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`서버 오류: ${response.status}`);
      }

      const data = await response.json();
      if (data?.success) {
        setResult(data.data);
        if (!isSearch) {
          alert("이미지가 성공적으로 추가되었습니다.");
        }
      } else {
        setError(data?.msg || `${actionName}에 실패했습니다.`);
      }
    } catch (err: any) {
      console.error(`Error during ${actionName}:`, err);
      setError(err?.message || `이미지 ${actionName} 중 오류가 발생했습니다.`);
    } finally {
      setLoading(false);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
      setResult(null);
      setError(null);
    }
  };

  return (
    <div className="cnn-container">
      <div className="upload-section">
        <h1>{mode == "search_image" ? "이미지 검색" : "이미지 추가"}</h1>
        <p>
          {mode == "search_image"
            ? "비슷한 이미지를 찾기 위해 이미지를 업로드하세요."
            : "이미지를 추가하기 위해 이미지를 업로드하세요."}
        </p>

        <input
          type="file"
          accept="image/*"
          id="file-upload"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <label
          htmlFor="file-upload"
          className="classify-button"
          style={{ textAlign: "center", display: "inline-block" }}
        >
          이미지 선택
        </label>

        {preview && (
          <div className="preview-container">
            <h3>미리보기</h3>
            <img
              src={preview}
              alt="Selected preview"
              className="preview-image"
            />
            <div style={{ marginTop: "1rem" }}>
              <button
                className="classify-button"
                onClick={handleAction}
                disabled={loading}
              >
                {loading
                  ? "로딩 중..."
                  : mode == "search_image"
                    ? "이미지 검색"
                    : "이미지 추가"}
              </button>
            </div>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        {result && mode == "search_image" && (
          <div className="results-container">
            <h2>검색 결과</h2>
            <div className="results-grid">
              {result.map((item: any) => (
                <div key={item.id} className="result-card">
                  <img
                    src={item.url}
                    alt={item.title}
                    className="result-image"
                  />
                  <div className="result-info">
                    <p className="result-title">{item.title}</p>
                    <p className="result-score">
                      유사도: {(item.score * 100).toFixed(2)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {result && mode == "insert_image_embedding" && (
          <div className="results-container">
            <h2>이미지 추가 결과</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImgEmbed;
