import { useEffect, useRef, useState } from "react";

const SF = "'Inter','Segoe UI',system-ui,sans-serif";

const stats = [
  { num: "94", suffix: "%", label: "Completion Rate" },
  { num: "10", suffix: "×", label: "Faster Learning" },
  { num: "500", suffix: "+", label: "Skill Domains" },
  { num: "∞", suffix: "", label: "Unique Paths" },
];

function CountUp({ target, suffix, start }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start || target === "∞") return;
    const end = parseFloat(target);
    const isDecimal = target.includes(".");
    let current = 0;
    const step = end / 60;
    const timer = setInterval(() => {
      current = Math.min(current + step, end);
      setVal(isDecimal ? current.toFixed(1) : Math.floor(current));
      if (current >= end) clearInterval(timer);
    }, 20);
    return () => clearInterval(timer);
  }, [start, target]);
  if (target === "∞")
    return (
      <>
        {target}
        {suffix}
      </>
    );
  return (
    <>
      {val}
      {suffix}
    </>
  );
}

export default function Stats() {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setStarted(true);
          obs.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        zIndex: 1,
        padding: "2.5rem 3rem",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        display: "flex",
        justifyContent: "center",
        gap: "5rem",
        flexWrap: "wrap",
        background: "rgba(21, 138, 62, 0.25)",
        backdropFilter: "blur(6px)",
        fontFamily: SF,
      }}
    >
      {stats.map((s) => (
        <div key={s.label} style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "2.2rem",
              fontWeight: 700,
              color: "#bddac6",
              lineHeight: 1,
            }}
          >
            <CountUp target={s.num} suffix={s.suffix} start={started} />
          </div>
          <div
            style={{
              fontSize: "0.72rem",
              color: "#bddac6",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginTop: "0.4rem",
              fontWeight: 500,
            }}
          >
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}
