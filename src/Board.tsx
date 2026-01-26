import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import { MemoStrtype } from "./types/global_types";
import { useNavigate } from "react-router-dom";
import Antigravity from "./Component/reactbits/Antigravity";

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
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* Background Layer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          //pointerEvents: "none", // Ensure it doesn't block clicks if not needed, though user wants mouse interaction so maybe remove this if it blocks the effect.
          // The effect relies on mouse position, which usually works globally or on the canvas.
          // If the canvas needs hover events, pointerEvents: "none" might block it IF the canvas listens to events on itself.
          // Looking at Antigravity.tsx: const { viewport: v, pointer: m } = state;
          // It uses global pointer from useThree state usually derived from canvas event listeners.
          // However, standard R3F Canvas captures events on the canvas element.
          // If we put it behind, and other divs are on top, the canvas might not get mouse events if they bubble/capture differently.
          // But R3F often uses window event listeners for pointer if configured, or the canvas element itself.
          // If I put z-index -1, the content on top (z-index 1) will block mouse events to the canvas.
          // `useThree` pointer usually tracks mouse across the canvas.
          // If the upper layer has no background color (transparent), pass-through might work for some events, but clicks usually hit the top element.
          // But for "background swish", it just reads mouse position. `useFrame` reads `state.pointer`.
          // `state.pointer` is normalized mouse coordinates. R3F updates this usually via event listeners on the canvas or window.
          // To be safe, I will NOT put pointerEvents: none on the container if it needs to receive events, BUT since it's a background, maybe it just needs to exist.
          // Actually, if z-index is -1, it's behind.
          // Let's just stick to the plan: layout changes.
        }}
      >
        <Antigravity
          count={1000}
          magnetRadius={16}
          ringRadius={12}
          waveSpeed={1.6}
          waveAmplitude={1.1}
          particleSize={1.5}
          lerpSpeed={0.05}
          color="#5227FF"
          autoAnimate
          particleVariance={1}
          rotationSpeed={0.6}
          depthFactor={1}
          pulseSpeed={3.2}
          particleShape="tetrahedron"
          fieldStrength={11}
        />
      </div>

      {/* Main Content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <h1>Board</h1>

        <div
          style={{
            padding: "10px",
            margin: "10px",
            border: "1px solid #ccc",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
          }}
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

        <div
          style={{
            padding: "10px",
            margin: "10px",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
          }}
        >
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
              style={{
                padding: "10px",
                margin: "10px",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                cursor: "pointer",
                border: "1px solid #eee",
              }}
            >
              <div>{item?.title}</div>
              <div>{item?.username}</div>
              <div>{item?.createdDt}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: "10px" }}>
          <button
            onClick={() => {
              navigate(`/tiptap`);
            }}
            style={{ padding: "10px 20px" }}
          >
            새로작성
          </button>
        </div>
      </div>
    </div>
  );
}

export default Board;
