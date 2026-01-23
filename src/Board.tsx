import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";

function Board() {
  const { userInfo, token } = useAuth();
  const [myinput, setMyinput] = useState("");
  const [boardList, setBoardList] = useState<string[]>([]);

  async function load() {
    await getBoardList();
  }
  async function getBoardList() {
    /** /api/board_v2/get_memo
     * method: GET
     * 여기서 fetch로 요청해서 데이터 가져오기
     */
  }
  useEffect(() => {
    load();
  }, []);

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
        {/* 인자는 ( )로 감싸고, 리턴 부분도 ( )로 감싸세요 */}
        {boardList?.map((item, index) => (
          <div key={index}>
            <div>{item}</div>
          </div>
        ))}
      </div>
      <div>
        <label>검색:</label>
        <input
          value={myinput}
          onKeyDown={(e) => {
            if (e.code.toLowerCase().includes("enter")) {
              let _temp = [...boardList, myinput];
              console.log(_temp);
              setBoardList(_temp);
            }
          }}
          onChange={(e) => {
            setMyinput(e.target.value);
          }}
        />
      </div>
      <div>{/**  */}</div>
    </div>
  );
}

export default Board;
