import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

function BoardUpsert() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const { userInfo, token } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  /** 앱은, 화면끼리 데이터 공유를 못해요.
   * login 페이지에서 token을 받고, Calc 같은 페이지로 이동하면,
   * 서버에서 받았던 정보 싹 날라가요
   * 이걸 고치려면 페이지끼리 데이터를 공유할 수 있는 방법을 찾아야 해요.
   1. query string : 주소창에 데이터 붙이는건데, 이건 정보보안법에 걸려요
   2. Context API : 이건 공용 저장소를 쉽게 안보이는곳에 저장해서 공유하는 방법이에요
   */
  const onUpdate = async () => {
    if (!title || !content) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);

      const response = await fetch(`${API_BASE_URL}/api/board/upsert`, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
        },
        body: formData,
      });

      let data = await response.json();
      console.log(data);

      if (data?.success) {
        data = data?.data;
        // alert("login successful! \nUser ID: " + data.userInfo.id);

        navigate("/board");
      } else {
        alert("글쓰기 실패: " + (data.msg || "Unknown error"));
      }
    } catch (error: any) {
      console.error("Error login:", error);
      alert(`글쓰기 실패: ${error?.message}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onUpdate();
    }
  };

  return (
    <div>
      <h1>게시글 작성 {token}</h1>

      <div>
        <label>제목:</label>
        <input
          value={title}
          onKeyDown={handleKeyDown}
          onChange={(e) => {
            setTitle(e?.target?.value);
          }}
        />
      </div>
      <div>
        <label>내용:</label>
        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
          }}
        />
      </div>
      <div>
        <button onClick={onUpdate}>글쓰기</button>
      </div>
    </div>
  );
}

export default BoardUpsert;
