import { Link } from "react-router-dom";
import GlitchText from "./reactbits/GlitchText";

function Header() {
  const items = [
    { label: "Calc", to: "/", color: "#3b82f6" },
    { label: "Board", to: "/board", color: "#10b981" },
    { label: "Register", to: "/register", color: "#f59e0b" },
    { label: "Login", to: "/login", color: "#ef4444" },
    { label: "Check Game", to: "/checkgame", color: "#8b5cf6" },
    { label: "Maze", to: "/maze", color: "#ec4899" },
    {
      label: "CNN",
      to: "/cnn",
      color: "#80dab4ff",
      children: [
        {
          label: "치와와vs머핀",
          to: "/cnn?model=classify_muffin_chihuahua",
        },
        {
          label: "치와와vs머핀 적대적방어",
          to: "/cnn?model=classify_muffin_chihuahua_fgsm",
        },
        {
          label: "밀 병충해",
          to: "/cnn?model=classify_plant_disease",
        },
        {
          label: "벌vsWasp",
          to: "/cnn?model=classify_bee_wasp",
        },
      ],
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1.5rem",
        padding: "1.5rem 2rem",
        backgroundColor: "#fff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        position: "relative", // Ensure z-index works for dropdown
        zIndex: 100,
      }}
    >
      <div>
        <GlitchText
          speed={2}
          enableShadows
          enableOnHover={false}
          className="custom-class"
        >
          광주컴퓨터 정보보안
        </GlitchText>
      </div>
      <nav style={{ display: "flex", gap: "1rem" }}>
        {items.map((item) => (
          <div
            key={item.label}
            style={{ position: "relative" }}
            onMouseEnter={(e) => {
              const dropdown = e.currentTarget.querySelector(".dropdown-menu");
              if (dropdown) {
                (dropdown as HTMLElement).style.display = "flex";
                (dropdown as HTMLElement).style.opacity = "1";
                (dropdown as HTMLElement).style.visibility = "visible";
                (dropdown as HTMLElement).style.transform = "translateY(0)";
              }
            }}
            onMouseLeave={(e) => {
              const dropdown = e.currentTarget.querySelector(".dropdown-menu");
              if (dropdown) {
                (dropdown as HTMLElement).style.opacity = "0";
                (dropdown as HTMLElement).style.visibility = "hidden";
                (dropdown as HTMLElement).style.transform = "translateY(-10px)";
                // Use timeout to allow transition to finish before hiding (optional, simplified here)
                // For simplicity in inline styles, we just hide it immediately after transition would hypothetically end
                // But with CSS transition, we might want to keep display block but toggle opacity.
                // Let's just use display none for simplicity or better yet, use visibility/opacity for transition.
              }
            }}
          >
            <Link
              to={item.to}
              style={{
                padding: "0.5rem 1.5rem",
                backgroundColor: item.color,
                color: "white",
                borderRadius: "9999px",
                textDecoration: "none",
                fontWeight: "500",
                transition: "all 0.2s",
                display: "block",
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
            {item.children && (
              <div
                className="dropdown-menu"
                style={{
                  position: "absolute",
                  top: "100%",
                  left: "50%",
                  transform: "translateX(-50%) translateY(-10px)",
                  backgroundColor: "white",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  borderRadius: "0.5rem",
                  padding: "0.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  width: "max-content",
                  zIndex: 10,
                  opacity: 0,
                  visibility: "hidden",
                  transition: "all 0.2s ease-in-out",
                  marginTop: "0.5rem",
                }}
              >
                {item.children.map((subItem) => (
                  <Link
                    key={subItem.label}
                    to={subItem.to}
                    style={{
                      padding: "0.5rem 1rem",
                      color: "#374151",
                      textDecoration: "none",
                      fontSize: "0.9rem",
                      borderRadius: "0.25rem",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f3f4f6";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    {subItem.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}

export default Header;
