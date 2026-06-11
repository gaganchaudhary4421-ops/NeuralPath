const SF = "'DM Sans', 'Segoe UI', system-ui, sans-serif";

export default function Hero() {
  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="home"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        fontFamily: SF,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.5; transform:scale(0.7); }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0px) translateX(-50%); }
          50%       { transform: translateY(-10px) translateX(-50%); }
        }

        .hero-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: rgba(45,212,96,0.12);
          border: 1px solid rgba(45,212,96,0.3);
          color: #2dd460;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.3rem 0.9rem;
          border-radius: 100px;
          margin-bottom: 1.5rem;
          width: fit-content;
          animation: fadeUp 0.6s 0.1s ease both;
        }

        .hero-title {
          font-size: clamp(2.2rem, 6vw, 4.8rem);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -0.04em;
          color: #fff;
          margin-bottom: 1.5rem;
          animation: fadeUp 0.7s 0.2s ease both;
        }

        .hero-sub {
          font-size: clamp(0.9rem, 2vw, 1rem);
          color: rgba(180,220,195,0.8);
          line-height: 1.8;
          font-weight: 400;
          max-width: 46ch;
          margin-bottom: 2.5rem;
          animation: fadeUp 0.7s 0.35s ease both;
        }

        .hero-actions {
          display: flex;
          gap: 0.85rem;
          flex-wrap: wrap;
          animation: fadeUp 0.7s 0.5s ease both;
          margin-bottom: 3rem;
        }

        .hero-btn-primary {
          background: linear-gradient(135deg, #0a4d21, #1aad4a);
          color: #fff;
          border: none;
          padding: 0.85rem 2rem;
          border-radius: 100px;
          font-family: ${SF};
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s;
          letter-spacing: 0.01em;
          box-shadow: 0 4px 24px rgba(26,173,74,0.3);
          white-space: nowrap;
        }
        .hero-btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 36px rgba(18,138,59,0.45);
        }

        .hero-btn-ghost {
          background: transparent;
          border: 1.5px solid rgba(255,255,255,0.2);
          color: rgba(255,255,255,0.75);
          padding: 0.85rem 2rem;
          border-radius: 100px;
          font-family: ${SF};
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s;
          white-space: nowrap;
        }
        .hero-btn-ghost:hover {
          border-color: rgba(255,255,255,0.5);
          color: #fff;
          background: rgba(255,255,255,0.05);
        }

        .hero-stats {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
          animation: fadeUp 0.7s 0.65s ease both;
        }

        .hero-stat-divider {
          width: 1px;
          background: rgba(255,255,255,0.12);
          align-self: stretch;
          min-height: 36px;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          padding: 8rem 3rem 6rem 5rem;
          max-width: 640px;
          width: 100%;
        }

        .hero-float-card {
          position: absolute;
          bottom: 2.5rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 3;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 14px;
          padding: 0.85rem 1.4rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          animation: floatY 5s 2s ease-in-out infinite;
          white-space: nowrap;
        }

        .hero-float-dot {
          width: 9px; height: 9px;
          border-radius: 50%;
          background: #2dd460;
          box-shadow: 0 0 10px #2dd460;
          flex-shrink: 0;
          animation: pulse 2s ease-in-out infinite;
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .hero-content {
            padding: 7rem 1.5rem 5rem 1.5rem;
            max-width: 100%;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .hero-sub {
            max-width: 100%;
          }
          .hero-actions {
            justify-content: center;
            width: 100%;
          }
          .hero-btn-primary,
          .hero-btn-ghost {
            width: 100%;
            text-align: center;
            justify-content: center;
          }
          .hero-stats {
            justify-content: center;
          }
          .hero-float-card {
            bottom: 1.5rem;
            font-size: 0.82rem;
            padding: 0.7rem 1rem;
          }
        }

        @media (max-width: 480px) {
          .hero-stat-divider { display: none; }
          .hero-stats { gap: 1.25rem; }
        }
      `}</style>

      {/* Background image */}
      <img
        src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1600&q=85"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          zIndex: 0,
        }}
      />

      {/* Base dark overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(4,14,8,0.45)",
          zIndex: 1,
        }}
      />

      {/* Smoky fade — left side */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "70%",
          height: "100%",
          background:
            "linear-gradient(to right, rgba(4,14,8,0.97) 0%, rgba(4,14,8,0.92) 35%, rgba(4,14,8,0.7) 65%, transparent 100%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Mobile — full dark overlay so text is always readable */}
      <style>{`
        @media (max-width: 768px) {
          .hero-mobile-overlay { display: block !important; }
        }
      `}</style>
      <div
        className="hero-mobile-overlay"
        style={{
          display: "none",
          position: "absolute",
          inset: 0,
          background: "rgba(4,14,8,0.82)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Top fade */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "25%",
          background:
            "linear-gradient(to bottom, rgba(4,14,8,0.8) 0%, transparent 100%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Bottom fade */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "25%",
          background:
            "linear-gradient(to top, rgba(4,14,8,0.8) 0%, transparent 100%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Text content — left */}
      <div className="hero-content">
        <h1 className="hero-title">
          Your Path to
          <span style={{ color: "#2dd460" }}> Mastery</span>
          <br />
          <span
            style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: "0.82em",
              fontWeight: 700,
            }}
          >
            Starts Here.
          </span>
        </h1>

        <p className="hero-sub">
          NeuralPath analyzes your unique skills, goals, and learning style to
          generate a hyper-personalized curriculum that evolves with you — week
          by week.
        </p>

        <div className="hero-actions">
          <button
            className="hero-btn-primary"
            onClick={() => scrollTo("generator")}
          >
            Generate My Path →
          </button>
          <button className="hero-btn-ghost" onClick={() => scrollTo("how")}>
            See how it works
          </button>
        </div>
      </div>
    </section>
  );
}
