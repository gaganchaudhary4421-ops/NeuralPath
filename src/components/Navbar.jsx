import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DARK_GREEN = "#0b3d1f";
const MID_GREEN = "#145a2e";
const BTN_BORDER = "#1a7a3c";
const WHITE = "#ffffff";

const navBtnStyle = {
  background: "transparent",
  border: `1px solid ${BTN_BORDER}`,
  color: DARK_GREEN,
  padding: "0.42rem 1.1rem",
  borderRadius: "100px",
  fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
  fontSize: "0.85rem",
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.2s",
  textDecoration: "none",
  display: "inline-block",
  letterSpacing: "0.01em",
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);

    const user = localStorage.getItem("np_user");
    setLoggedIn(!!user && user !== "null");

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) setMenuOpen(false);
  }, [isMobile]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && menuOpen) setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const scrollTo = (id) => {
    setMenuOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.setAttribute("tabindex", "-1");
          el.focus({ preventScroll: true });
        }
      }, 500);
    }, 100);
  };

  const handleStartLearning = () => {
    setMenuOpen(false);
    const user = localStorage.getItem("np_user");
    const isLoggedIn = user && user !== "null";
    if (isLoggedIn) {
      scrollTo("generator");
    } else {
      navigate("/login", { state: { redirectTo: "/" } });
    }
  };

  const navLinks = [
    ["home", "Home"],
    ["features", "Features"],
    ["generator", "Generate"],
    ["how", "How it works"],
  ];

  return (
    <>
      <header
        role="banner"
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 100,
          background: WHITE,
          boxShadow: scrolled
            ? "0 2px 20px rgba(11,61,31,0.10)"
            : "0 1px 0 rgba(11,61,31,0.07)",
          transition: "box-shadow 0.3s",
          boxSizing: "border-box",
        }}
      >
        <nav
          aria-label="Main navigation"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: isMobile ? "0.875rem 1.25rem" : "1rem 3rem",
            fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
          }}
        >
          {/* Logo */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
            aria-label="NeuralPath — Go to homepage"
            style={{
              fontSize: "1.3rem",
              fontWeight: 800,
              color: DARK_GREEN,
              letterSpacing: "-0.02em",
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            Neural<span style={{ color: "#1db954" }}>Path</span>
          </a>

          {/* Desktop nav links */}
          {!isMobile && (
            <ul
              role="list"
              aria-label="Site sections"
              style={{
                display: "flex",
                gap: "0.75rem",
                listStyle: "none",
                margin: 0,
                padding: 0,
                alignItems: "center",
              }}
            >
              {navLinks.map(([id, label]) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(id);
                    }}
                    aria-label={`Navigate to ${label} section`}
                    style={{ ...navBtnStyle }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = DARK_GREEN;
                      e.currentTarget.style.color = WHITE;
                      e.currentTarget.style.borderColor = DARK_GREEN;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = DARK_GREEN;
                      e.currentTarget.style.borderColor = BTN_BORDER;
                    }}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          )}

          {/* Desktop right buttons */}
          {!isMobile && (
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
            >
              {loggedIn && (
                <button
                  onClick={() => navigate("/dashboard")}
                  aria-label="Go to your learning dashboard"
                  style={{ ...navBtnStyle }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = DARK_GREEN;
                    e.currentTarget.style.color = WHITE;
                    e.currentTarget.style.borderColor = DARK_GREEN;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = DARK_GREEN;
                    e.currentTarget.style.borderColor = BTN_BORDER;
                  }}
                >
                  Dashboard
                </button>
              )}
              <button
                onClick={handleStartLearning}
                aria-label={
                  loggedIn
                    ? "Start generating your learning path"
                    : "Log in and start learning"
                }
                style={{
                  background: DARK_GREEN,
                  border: `1px solid ${DARK_GREEN}`,
                  color: WHITE,
                  padding: "0.5rem 1.5rem",
                  borderRadius: "100px",
                  fontFamily: "inherit",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = MID_GREEN;
                  e.currentTarget.style.borderColor = MID_GREEN;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = DARK_GREEN;
                  e.currentTarget.style.borderColor = DARK_GREEN;
                }}
              >
                Start Learning <span aria-hidden="true">→</span>
              </button>
            </div>
          )}

          {/* Mobile hamburger */}
          {isMobile && (
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={
                menuOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "0.25rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "5px",
                width: "32px",
                height: "32px",
              }}
            >
              {/* Animated hamburger bars */}
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{
                    display: "block",
                    width: "22px",
                    height: "2px",
                    background: DARK_GREEN,
                    borderRadius: "2px",
                    transition: "all 0.25s ease",
                    transformOrigin: "center",
                    transform: menuOpen
                      ? i === 0
                        ? "translateY(7px) rotate(45deg)"
                        : i === 1
                          ? "opacity: 0; scaleX(0)"
                          : "translateY(-7px) rotate(-45deg)"
                      : "none",
                    opacity: menuOpen && i === 1 ? 0 : 1,
                  }}
                />
              ))}
            </button>
          )}
        </nav>
      </header>

      {/* Mobile drawer */}
      {isMobile && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 98,
              background: "rgba(11,61,31,0.18)",
              backdropFilter: "blur(2px)",
              opacity: menuOpen ? 1 : 0,
              pointerEvents: menuOpen ? "auto" : "none",
              transition: "opacity 0.25s ease",
            }}
          />

          {/* Slide-down menu panel */}
          <div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            style={{
              position: "fixed",
              top: "56px",
              left: 0,
              right: 0,
              zIndex: 99,
              background: WHITE,
              boxShadow: "0 8px 32px rgba(11,61,31,0.12)",
              padding: menuOpen ? "1.5rem 1.25rem 2rem" : "0 1.25rem",
              maxHeight: menuOpen ? "420px" : "0",
              overflow: "hidden",
              transition: "max-height 0.3s ease, padding 0.3s ease",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            {/* Nav links */}
            <ul
              role="list"
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: "0.4rem",
              }}
            >
              {navLinks.map(([id, label]) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(id);
                    }}
                    style={{
                      display: "block",
                      padding: "0.7rem 1rem",
                      borderRadius: "10px",
                      color: DARK_GREEN,
                      fontFamily:
                        "'DM Sans', 'Segoe UI', system-ui, sans-serif",
                      fontSize: "1rem",
                      fontWeight: 600,
                      textDecoration: "none",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#f0f7f2")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Divider */}
            <div
              style={{
                height: "1px",
                background: "rgba(11,61,31,0.08)",
                margin: "0.5rem 0",
              }}
            />

            {/* CTA buttons */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {loggedIn && (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/dashboard");
                  }}
                  style={{
                    ...navBtnStyle,
                    width: "100%",
                    textAlign: "center",
                    padding: "0.7rem 1rem",
                    fontSize: "0.95rem",
                    borderRadius: "10px",
                  }}
                >
                  Dashboard
                </button>
              )}
              <button
                onClick={handleStartLearning}
                style={{
                  background: DARK_GREEN,
                  border: `1px solid ${DARK_GREEN}`,
                  color: WHITE,
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
                  fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  width: "100%",
                  letterSpacing: "0.01em",
                }}
              >
                Start Learning →
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
