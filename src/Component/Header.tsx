import { Link } from "react-router-dom";

function Header() {
  return (
    <div>
      <h1>헤더</h1>
      <li>
        <Link to="/">calc</Link>
        <Link to="/board">board</Link>
        <Link to="/register">register</Link>
        <Link to="/login">login</Link>
      </li>
    </div>
  );
}

export default Header;
