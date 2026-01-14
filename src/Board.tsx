import { useState } from "react";

function Board() {
  const [myinput, setMyinput] = useState("");
  const [boardList, setBoardList] = useState<string[]>([]);
  return (
    <div>
      <h1>Board</h1>
      <div>
        <label>글 입력:</label>
        <input
          value={myinput}
          onChange={(e) => {
            setMyinput(e.target.value);
          }}
        />
      </div>
    </div>
  );
}

export default Board;
