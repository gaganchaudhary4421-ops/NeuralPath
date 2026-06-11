const SF = "'Inter','Segoe UI',system-ui,sans-serif";

const features = [
  {
    title: "Skill Gap Analysis",
    desc: "Deep analysis of your current knowledge map vs. target role requirements — pinpoints exactly what's missing and in what order to fix it.",
    img: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=600&q=80",
  },
  {
    title: "Adaptive Roadmaps",
    desc: "Paths that restructure dynamically based on your performance, skipping what you already know and doubling down where you need it.",
    img: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&q=80",
  },
  {
    title: "Velocity Calibration",
    desc: "Calibrates learning intensity to your actual pace and weekly hours — no falling behind, no waiting around.",
    img: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80",
  },
  {
    title: "Goal Alignment",
    desc: "Maps every resource and milestone directly to career outcomes, certifications, or portfolio pieces you're building toward.",
    img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80",
  },
  {
    title: "Progress Insights",
    desc: "Visual analytics with predicted mastery timelines and early signals when you're drifting off the optimal track.",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
  },
  {
    title: "Resource Curation",
    desc: "Every step links to the highest-quality free and paid resources — no filler, no outdated content, no time wasted.",
    img: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      style={{
        padding: "6rem 3rem",
        background: "#f0faf4",
        fontFamily: SF,
      }}
    >
      <style>{`
        .feat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .feat-card {
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 16px rgba(11,61,31,0.07);
          border: 1px solid rgba(11,61,31,0.08);
          transition: transform 0.25s, box-shadow 0.25s;
          cursor: default;
        }

        .feat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 32px rgba(11,61,31,0.13);
        }

        .feat-img {
          width: 100%;
          height: 160px;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }

        .feat-card:hover .feat-img {
          transform: scale(1.04);
        }

        .feat-img-wrap {
          overflow: hidden;
          position: relative;
        }

        .feat-img-wrap::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 60px;
          background: linear-gradient(to bottom, transparent, #ffffff);
        }

        .feat-body {
          padding: 1.4rem 1.6rem 1.8rem;
        }

        .feat-tag {
          display: inline-block;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #16a34a;
          background: #dcfce7;
          padding: 0.2rem 0.6rem;
          border-radius: 100px;
          margin-bottom: 0.75rem;
        }

        .feat-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #0b3d1f;
          margin-bottom: 0.5rem;
          line-height: 1.3;
        }

        .feat-desc {
          font-size: 0.875rem;
          color: #4b7a5e;
          line-height: 1.68;
          font-weight: 700;
        }

        .feat-header {
          max-width: 1200px;
          margin: 0 auto 3rem;
        }
      `}</style>

      <div className="feat-header">
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
          Built different.
          <br />
          For learners who are serious.
        </h2>
        <p
          style={{
            fontSize: "1.125rem",
            color: "#4b7a5e",
            lineHeight: 1.75,
            fontWeight: 700,
            maxWidth: "58ch",
          }}
        >
          Not a course catalog. Not a random playlist. A living, adaptive system
          that knows exactly where you are and where you need to go.
        </p>
      </div>

      <div className="feat-grid">
        {features.map((f) => (
          <div className="feat-card" key={f.title}>
            <div className="feat-img-wrap">
              <img src={f.img} alt={f.title} className="feat-img" />
            </div>
            <div className="feat-body">
              <span className="feat-tag">Feature</span>
              <div className="feat-title">{f.title}</div>
              <p className="feat-desc">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
