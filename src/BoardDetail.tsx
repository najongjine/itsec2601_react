import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import { MemoStrtype } from "./types/global_types";
import { useSearchParams } from "react-router-dom";
import DOMPurify from "dompurify";

function BoardDetail() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [searchParams, setSearchParams] = useSearchParams();
  const boardId = Number(searchParams.get(`id`));
  const { userInfo, token } = useAuth();
  const [myinput, setMyinput] = useState("");
  const [board, setBoard] = useState<MemoStrtype>({});

  async function load() {
    await getBoard(boardId);
  }
  async function getBoard(id: number) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/board_v2/get_memo_by_id?id=${id}`,
        {
          method: "GET", // GET은 생략 가능하지만 명시적으로 작성함
        },
      );

      // HTTP 에러 상태 체크 (200-299 범위가 아니면 에러 처리)
      if (!response.ok) {
        alert(` fetch 에러. ${response?.statusText}`);
        return;
      }

      // JSON 데이터 파싱 및 반환
      const data: any = await response.json();
      console.log(`data : `, data);
      if (!data?.success) {
        alert(` 서버 에러. ${data?.msg}`);
        return;
      }
      setBoard(data?.data || {});
    } catch (error: any) {
      alert(`에러. 데이터를 가져오는 중 오류 발생. ${error?.message}`);
    }
  }
  useEffect(() => {
    load();
  }, [boardId]);

  return (
    <div>
      <h1>Board 상세</h1>

      <div>{board?.title}</div>
      <div
        className="view-content"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(board?.htmlContent || ""),
        }}
      />
    </div>
  );
}

export default BoardDetail;
