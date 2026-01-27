import { Link } from "react-router-dom";

function Header() {
  const items = [
    { label: "Calc", to: "/", color: "#3b82f6" },
    { label: "Board", to: "/board", color: "#10b981" },
    { label: "Register", to: "/register", color: "#f59e0b" },
    { label: "Login", to: "/login", color: "#ef4444" },
  ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem 2rem",
        backgroundColor: "#fff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>헤더</div>
      <nav style={{ display: "flex", gap: "1rem" }}>
        {items.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            style={{
              padding: "0.5rem 1.5rem",
              backgroundColor: item.color,
              color: "white",
              borderRadius: "9999px",
              textDecoration: "none",
              fontWeight: "500",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default Header;
