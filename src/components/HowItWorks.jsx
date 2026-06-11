const SF = "'Inter','Segoe UI',system-ui,sans-serif";

const steps = [
  {
    title: "Profile Ingestion",
    desc: "We map your existing skills, learning preferences, available time, and end goal into a structured knowledge model.",
    img: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&q=80",
  },
  {
    title: "Gap Computation",
    desc: "The AI compares your current state to role requirements and identifies the most efficient learning sequence.",
    img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80",
  },
  {
    title: "Path Generation",
    desc: "A week-by-week roadmap is synthesized — each step building prerequisite knowledge for the next.",
    img: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&q=80",
  },
  {
    title: "Continuous Refinement",
    desc: "Track progress, update your profile, and regenerate — the path adapts as you grow.",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how"
      style={{
        padding: "6rem 3rem",
        background: "#f0faf4",
        fontFamily: SF,
      }}
    >
      <style>{`
        .hiw-header {
          max-width: 1200px;
          margin: 0 auto 3rem;
        }

        .hiw-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .hiw-card {
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 16px rgba(11,61,31,0.07);
          border: 1px solid rgba(11,61,31,0.08);
          transition: transform 0.25s, box-shadow 0.25s;
          cursor: default;
        }

        .hiw-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 32px rgba(11,61,31,0.13);
        }

        .hiw-img-wrap {
          overflow: hidden;
          position: relative;
          height: 150px;
        }

        .hiw-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }

        .hiw-card:hover .hiw-img {
          transform: scale(1.05);
        }

        .hiw-img-wrap::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 60px;
          background: linear-gradient(to bottom, transparent, #ffffff);
        }

        .hiw-step-num {
          font-size: 3.5rem;
          font-weight: 800;
          color: rgba(11,61,31,0.08);
          line-height: 1;
          margin-bottom: 0.25rem;
          user-select: none;
        }

        .hiw-body {
          padding: 1.2rem 1.5rem 1.7rem;
        }

        .hiw-tag {
          display: inline-block;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #16a34a;
          background: #dcfce7;
          padding: 0.2rem 0.6rem;
          border-radius: 100px;
          margin-bottom: 0.65rem;
        }

        .hiw-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #0b3d1f;
          margin-bottom: 0.5rem;
          line-height: 1.3;
        }

        .hiw-desc {
          font-size: 0.875rem;
          color: #4b7a5e;
          line-height: 1.68;
          font-weight: 400;
        }

        .hiw-connector {
          max-width: 1200px;
          margin: 0 auto;
          opacity: 0.5;
        }
      `}</style>

      <div className="hiw-header">
        <h2
          style={{
            fontSize: "clamp(1.8rem,4vw,3rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "#0b3d1f",
            marginBottom: "1rem",
            lineHeight: 1.1,
          }}
        >
          Four steps to mastery
        </h2>
        <p
          style={{
            fontSize: "1rem",
            color: "#4b7a5e",
            lineHeight: 1.75,
            fontWeight: 700,
            maxWidth: "52ch",
          }}
        >
          The intelligence layer that sits between you and information overload.
        </p>
      </div>

      <div className="hiw-grid">
        {steps.map((s, i) => (
          <div className="hiw-card" key={s.title}>
            <div className="hiw-img-wrap">
              <img src={s.img} alt={s.title} className="hiw-img" />
            </div>
            <div className="hiw-body">
              <div className="hiw-step-num">0{i + 1}</div>
              <span className="hiw-tag">Step {i + 1}</span>
              <div className="hiw-title">{s.title}</div>
              <p className="hiw-desc">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="hiw-connector" aria-hidden="true">
        <svg
          viewBox="0 0 900 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", height: "auto" }}
        >
          <path
            d="M50 40 C150 10, 200 70, 300 40 C400 10, 450 70, 550 40 C650 10, 700 70, 850 40"
            stroke="url(#g1)"
            strokeWidth="1.5"
            strokeDasharray="6 4"
          />
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#16a34a" stopOpacity="0" />
              <stop offset="30%" stopColor="#16a34a" stopOpacity="0.5" />
              <stop offset="70%" stopColor="#16a34a" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#16a34a" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
}
