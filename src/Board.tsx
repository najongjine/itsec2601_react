import { useState } from "react";
import { useAuth } from "./context/AuthContext";

function Board() {
  const { userInfo, token } = useAuth();
  const [myinput, setMyinput] = useState("");
  const [boardList, setBoardList] = useState<string[]>([]);
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
            <p>
              <strong>Token:</strong>{" "}
              {token ? `${token.substring(0, 20)}...` : "None"}
            </p>
            <details>
              <summary>Full Token</summary>
              <p style={{ wordBreak: "break-all" }}>{token}</p>
            </details>
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
        <label>글 입력:</label>
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
    </div>
  );
}

export default Board;
