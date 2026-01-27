import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import { MemoStrtype } from "./types/global_types";
import { useNavigate, useSearchParams } from "react-router-dom";
import DOMPurify from "dompurify";
import "./BoardDetail.scss";

function BoardDetail() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const boardId = Number(searchParams.get(`id`));
  const { userInfo, token } = useAuth();
  const [board, setBoard] = useState<MemoStrtype>({});

  async function load() {
    await getBoard(boardId);
  }
  async function getBoard(id: number) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/board_v2/get_memo_by_id?id=${id}`,
        {
          method: "GET",
        },
      );

      if (!response.ok) {
        alert(` fetch 에러. ${response?.statusText}`);
        return;
      }

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
    }
  }
  useEffect(() => {
    load();
  }, [boardId]);

  return (
    <div className="board-detail-container">
      <div className="board-card">
        <header className="board-header">
          <h1>{board?.title || "제목 없음"}</h1>
          <div className="board-meta">
            <span>
              By <strong>{board?.username ?? "익명"}</strong>
            </span>
            <span className="meta-divider"></span>
            <span>
              {board?.createdDt
                ? new Date(board.createdDt).toLocaleString()
                : ""}
            </span>
          </div>
        </header>

        <div
          className="board-content"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(board?.htmlContent || ""),
          }}
        />

        <div className="board-actions">
          <button className="btn btn-list" onClick={() => navigate("/board")}>
            목록으로
          </button>

          {userInfo?.id === board?.userId && (
            <>
              <button
                className="btn btn-edit"
                title="수정"
                onClick={async () => {
                  navigate(`/tiptap?id=${boardId}`);
                }}
              >
                수정
              </button>
              <button
                className="btn btn-delete"
                title="삭제"
                onClick={async () => {
                  onDelete();
                }}
              >
                삭제
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default BoardDetail;
