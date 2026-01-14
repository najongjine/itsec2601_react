import { useState } from "react";

function Board() {
  const [myinput, setMyinput] = useState("");
  const [boardList, setBoardList] = useState<string[]>([]);
  return (
    <div>
      <h1>Board</h1>
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
