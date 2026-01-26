import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import { MemoStrtype } from "./types/global_types";
import { useNavigate } from "react-router-dom";

function Board() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const { userInfo, token } = useAuth();
  const [myinput, setMyinput] = useState("");
  const [boardList, setBoardList] = useState<MemoStrtype[]>([]);

  async function load() {
    await getBoardList();
  }
  async function getBoardList() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/board_v2/get_memo`, {
        method: "GET", // GET은 생략 가능하지만 명시적으로 작성함
      });

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
      setBoardList(data?.data || []);
    } catch (error: any) {
      alert(`에러. 데이터를 가져오는 중 오류 발생. ${error?.message}`);
    }
  }
  useEffect(() => {
    load();
  }, []);

  function onItemClick(id: number | undefined) {
    navigate(`/board_detail?id=${id || 0}`);
  }

  return (
    <div>
      <h1>Board</h1>
      <div
        style={{ padding: "10px", margin: "10px", border: "1px solid #ccc" }}
      >
        <h3>Logged In User Info:</h3>
        {userInfo ? (
          <div>
            <p>
              <strong>ID:</strong> {userInfo.id}
            </p>
            <p>
              <strong>Username:</strong> {userInfo.username}
            </p>
          </div>
        ) : (
          <p>Not logged in</p>
        )}
      </div>

      <div>
        <label>검색:</label>
        <input
          value={myinput}
          onKeyDown={(e) => {
            if (e.code.toLowerCase().includes("enter")) {
            }
          }}
          onChange={(e) => {
            setMyinput(e.target.value);
          }}
        />
      </div>
      <div>
        {/* 인자는 ( )로 감싸고, 리턴 부분도 ( )로 감싸세요 */}
        {boardList?.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              onItemClick(item?.id);
            }}
          >
            <div>{item?.title}</div>
            <div>{item?.username}</div>
            <div>{item?.createdDt}</div>
          </div>
        ))}
      </div>
      <div>
        <button
          onClick={() => {
            navigate(`/tiptap`);
          }}
        >
          새로작성
        </button>
      </div>
    </div>
  );
}

export default Board;
