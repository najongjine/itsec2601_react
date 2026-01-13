import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./Component/Header";
import Footer from "./Component/Footer";
import Calc from "./Calc";
import Board from "./Board";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Calc />} />
          <Route path="/board" element={<Board />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
