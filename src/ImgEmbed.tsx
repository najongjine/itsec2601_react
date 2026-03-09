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

  return (
    <div>
      {mode === "search_image" && (
        <div>
          <h1>이미지 검색</h1>
        </div>
      )}
    </div>
  );
}

export default ImgEmbed;
