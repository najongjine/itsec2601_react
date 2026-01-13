import { Link } from "react-router-dom";

function Header() {
  return (
    <div>
      <h1>헤더</h1>
      <li>
        <Link to="/">calc</Link>
        <Link to="/board">board</Link>
      </li>
    </div>
  );
}

export default Header;
