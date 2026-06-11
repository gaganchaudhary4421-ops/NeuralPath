const SF = "'Inter','Segoe UI',system-ui,sans-serif";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(255,255,255,0.05)",
        padding: "3.5rem 3rem",
        textAlign: "center",
        position: "relative",
        zIndex: 1,
        background: "rgba(2,13,6,0.5)",
        fontFamily: SF,
      }}
    >
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div
          style={{
            fontSize: "1.6rem",
            fontWeight: 800,
            color: "#fff",
            marginBottom: "0.6rem",
            letterSpacing: "-0.02em",
          }}
        >
          Neural<span style={{ color: "#2dd460" }}>Path</span>
        </div>
        <p
          style={{
            color: "rgb(249, 249, 249)",
            fontSize: "0.875rem",
            marginBottom: "1rem",
            fontWeight: 700,
          }}
        >
          AI-Powered Personalized Learning Intelligence
        </p>
      </div>
    </footer>
  );
}
