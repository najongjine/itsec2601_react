import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import { MemoStrtype } from "./types/global_types";
import { useNavigate, useSearchParams } from "react-router-dom";
import DOMPurify from "dompurify";

function BoardDetail() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
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
  async function onDelete() {
    try {
      if (!confirm(`정말로 삭제 하시겠습니까?`)) {
        return;
      }
      const payload = {
        id: boardId,
      };
      let res: any = await fetch(`${API_BASE_URL}/api/board_v2/delete_by_id`, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
        },
        body: JSON.stringify(payload),
      });

      res = await res.json();
      console.log("--- res: ", res);
      if (!res?.success) {
        alert(`저장 실패. ${res?.msg ?? ""}`);
        return;
      }

      navigate("/board");
    } catch (error: any) {
      alert(`문서 저장 중 오류 발생. ${error?.msg ?? ""}`);
      // 사용자에게 오류를 알리는 로직 추가
    }
  }
  useEffect(() => {
    load();
  }, [boardId]);

  return (
    <div>
      <h1>Board 상세</h1>

      <div>{board?.title}</div>
      <div>{board?.createdDt}</div>
      <div>{board?.username ?? "몰라"}</div>
      <div
        className="view-content"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(board?.htmlContent || ""),
        }}
      />

      <div>
        {userInfo?.id === board?.userId && (
          <div>
            <button
              title="수정"
              onClick={async () => {
                navigate(`/tiptap?id=${boardId}`);
              }}
            >
              수정
            </button>
            <button
              title="삭제"
              onClick={async () => {
                onDelete();
              }}
            >
              삭제
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BoardDetail;
