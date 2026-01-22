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

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Calc />} />
            <Route path="/board" element={<Board />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/board_upsert" element={<BoardUpsert />} />
            <Route path="/tiptap" element={<MyEditor />} />
          </Routes>
          <Footer />
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
