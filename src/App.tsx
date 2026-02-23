import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./Component/Header";
import Footer from "./Component/Footer";
import Calc from "./Calc";
import Board from "./Board";
import Register from "./Register";
import Login from "./Login";
import { AuthProvider } from "./context/AuthContext";
import BoardUpsert from "./BoardUpsert";
import TipTapSample from "./TipTapSample";
import MyEditor from "./MyEditor";
import BoardDetail from "./BoardDetail";
import SplashCursor from "./Component/reactbits/SplashCursor";
import ChessPage from "./Component/Chess/ChessPage";
import MazePage from "./Component/Maze/MazePage";
import CNN from "./CNN";
import FaceRecog from "./FaceRecog";

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Header />
          <SplashCursor />
          <Routes>
            <Route path="/" element={<Calc />} />
            <Route path="/board" element={<Board />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/board_upsert" element={<BoardUpsert />} />
            <Route path="/tiptap" element={<MyEditor />} />
            <Route path="/board_detail" element={<BoardDetail />} />
            <Route path="/checkgame" element={<ChessPage />} />
            <Route path="/maze" element={<MazePage />} />
            <Route path="/cnn" element={<CNN />} />
            <Route path="/facerecog" element={<FaceRecog />} />
          </Routes>
          <Footer />
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
