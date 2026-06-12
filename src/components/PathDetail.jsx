import { useState, useEffect } from "react";
const BASE = "http://localhost:8000";

const C = {
  brand: "#1a6b3c",
  brandLight: "#2d9c5c",
  brandPale: "#e8f5ee",
  dark: "#0b3d1f",
  white: "#ffffff",
  border: "#daeee3",
  text: "#1a2e22",
  muted: "#4a7a5c",
  dimmed: "#7aaa8a",
  accent: "#4ade80",
  warn: "#fef3c7",
  warnText: "#92400e",
  good: "#d1fae5",
  goodText: "#065f46",
  err: "#fef2f2",
  errText: "#b91c1c",
};

const api = (path, token, opts = {}) =>
  fetch(`${BASE}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(opts.headers || {}),
    },
  }).then((r) => r.json());

function Badge({ children, color = C.brandPale, text = C.brand }) {
  return (
    <span
      style={{
        fontSize: 11,
        padding: "3px 10px",
        borderRadius: 20,
        background: color,
        color: text,
        fontWeight: 600,
      }}
    >
      {children}
    </span>
  );
}
//button function
function Btn({ children, onClick, disabled, variant = "primary", small }) {
  const [hov, setHov] = useState(false);
  const bg =
    variant === "primary"
      ? hov
        ? C.brandLight
        : C.brand
      : variant === "ghost"
        ? hov
          ? C.brandPale
          : "transparent"
        : hov
          ? "#fde68a"
          : C.warn;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: small ? "5px 12px" : "8px 18px",
        background: disabled ? "#e5e7eb" : bg,
        color: disabled
          ? "#9ca3af"
          : variant === "primary"
            ? C.white
            : variant === "ghost"
              ? C.brand
              : C.warnText,
        border: variant === "ghost" ? `1px solid ${C.border}` : "none",
        borderRadius: 8,
        fontSize: small ? 12 : 13,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.15s",
        opacity: disabled ? 0.7 : 1,
      }}
    >
      {children}
    </button>
  );
}

function ExplainModal({ topic, explanation, onClose, loading }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.white,
          borderRadius: 18,
          width: 540,
          maxWidth: "95vw",
          maxHeight: "80vh",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            background: C.dark,
            padding: "18px 22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p
              style={{
                fontSize: 11,
                color: C.accent,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                margin: 0,
              }}
            >
              💡 Explain Like I'm Stuck
            </p>
            <p
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: C.white,
                margin: "4px 0 0",
              }}
            >
              {topic}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "none",
              color: C.white,
              fontSize: 18,
              cursor: "pointer",
              borderRadius: 6,
              width: 30,
              height: 30,
            }}
          >
            ×
          </button>
        </div>

        <div style={{ padding: "20px 22px", overflowY: "auto", flex: 1 }}>
          {loading ? (
            <div
              style={{ textAlign: "center", padding: "40px 0", color: C.muted }}
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>🧠</div>
              <p style={{ fontSize: 14 }}>
                Generating your personalized explanation…
              </p>
            </div>
          ) : (
            <div
              style={{
                fontSize: 14,
                color: C.text,
                lineHeight: 1.8,
                whiteSpace: "pre-wrap",
              }}
            >
              {explanation}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function QuizModal({ quiz, weekNumber, pathId, token, onClose, onResult }) {
  const [selected, setSelected] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const allAnswered = Object.keys(selected).length === quiz.length;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const answers = Object.entries(selected).map(([qi, opt]) => ({
        question_index: parseInt(qi),
        selected_option: opt,
      }));
      const res = await api(`/learning/${pathId}/quiz/submit`, token, {
        method: "POST",
        body: JSON.stringify({
          week_number: weekNumber,
          answers,
          questions: quiz,
        }),
      });
      setResult(res);
      setSubmitted(true);
      onResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={!submitted ? undefined : onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.white,
          borderRadius: 18,
          width: 560,
          maxWidth: "95vw",
          maxHeight: "85vh",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.22)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: C.dark,
            padding: "18px 22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p
              style={{
                fontSize: 11,
                color: C.accent,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                margin: 0,
              }}
            >
              📝 Week {weekNumber} Quiz
            </p>
            <p
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: C.white,
                margin: "4px 0 0",
              }}
            >
              {submitted ? "Results" : "Answer all 3 questions"}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "none",
              color: C.white,
              fontSize: 18,
              cursor: "pointer",
              borderRadius: 6,
              width: 30,
              height: 30,
            }}
          >
            ×
          </button>
        </div>

        <div style={{ padding: "20px 22px", overflowY: "auto", flex: 1 }}>
          {!submitted ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {quiz.map((q, qi) => (
                <div key={qi}>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: C.text,
                      marginBottom: 10,
                    }}
                  >
                    {qi + 1}. {q.question}
                  </p>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 6 }}
                  >
                    {q.options.map((opt, oi) => {
                      const chosen = selected[qi] === oi;
                      return (
                        <button
                          key={oi}
                          onClick={() =>
                            setSelected((s) => ({ ...s, [qi]: oi }))
                          }
                          style={{
                            textAlign: "left",
                            padding: "10px 14px",
                            borderRadius: 8,
                            fontSize: 13,
                            border: `1.5px solid ${chosen ? C.brand : C.border}`,
                            background: chosen ? C.brandPale : C.white,
                            color: chosen ? C.brand : C.text,
                            cursor: "pointer",
                            fontWeight: chosen ? 600 : 400,
                            transition: "all 0.12s",
                          }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: result.score_pct >= 70 ? C.good : C.warn,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  fontSize: 28,
                }}
              >
                {result.score_pct >= 70 ? "🚀" : ""}
              </div>
              <p
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: C.dark,
                  margin: "0 0 4px",
                }}
              >
                {result.score_pct}%
              </p>
              <p style={{ fontSize: 14, color: C.muted, marginBottom: 16 }}>
                {result.score} / {quiz.length} correct
              </p>
              <div
                style={{
                  background: result.score_pct >= 70 ? C.good : C.warn,
                  borderRadius: 10,
                  padding: "12px 16px",
                  fontSize: 13,
                  fontWeight: 500,
                  color: result.score_pct >= 70 ? C.goodText : C.warnText,
                  marginBottom: 16,
                }}
              >
                {result.message}
              </div>
              {result.weak_topics?.length > 0 && (
                <div style={{ textAlign: "left" }}>
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: C.dimmed,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      marginBottom: 6,
                    }}
                  >
                    Areas to strengthen
                  </p>
                  {result.weak_topics.map((t, i) => (
                    <p
                      key={i}
                      style={{
                        fontSize: 13,
                        color: C.text,
                        padding: "6px 10px",
                        background: C.brandPale,
                        borderRadius: 6,
                        marginBottom: 4,
                      }}
                    >
                      • {t}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "14px 22px",
            borderTop: `1px solid ${C.border}`,
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
          }}
        >
          {!submitted ? (
            <>
              <Btn variant="ghost" onClick={onClose}>
                Cancel
              </Btn>
              <Btn onClick={handleSubmit} disabled={!allAnswered || loading}>
                {loading ? "Submitting…" : "Submit Answers"}
              </Btn>
            </>
          ) : (
            <Btn onClick={onClose}>Close & See Updated Path</Btn>
          )}
        </div>
      </div>
    </div>
  );
}

function WeekCard({
  week,
  pathId,
  token,
  quizHistory,
  onQuizComplete,
  onExplain,
  completedWeeks,
}) {
  const [open, setOpen] = useState(week.week === 1);
  const [quizData, setQuizData] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const isCompleted = completedWeeks.includes(week.week);

  const loadQuiz = async () => {
    setQuizLoading(true);
    try {
      const res = await api(`/learning/${pathId}/quiz/generate`, token, {
        method: "POST",
        body: JSON.stringify({ week_number: week.week }),
      });
      setQuizData(res.questions);
      setShowQuiz(true);
    } catch (e) {
      console.error(e);
    } finally {
      setQuizLoading(false);
    }
  };

  return (
    <>
      {showQuiz && quizData && (
        <QuizModal
          quiz={quizData}
          weekNumber={week.week}
          pathId={pathId}
          token={token}
          quizHistory={quizHistory}
          onClose={() => setShowQuiz(false)}
          onResult={(result) => {
            setShowQuiz(false);
            onQuizComplete(week.week, result);
          }}
        />
      )}

      <div
        style={{
          background: C.white,
          border: `1px solid ${isCompleted ? "#86efac" : C.border}`,
          borderRadius: 14,
          overflow: "hidden",
          transition: "border-color 0.3s",
          boxShadow: isCompleted ? "0 0 0 2px #bbf7d040" : "none",
        }}
      >
        {/* Week header */}
        <div
          onClick={() => setOpen((o) => !o)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 18px",
            cursor: "pointer",
            background: open ? C.brandPale : C.white,
            transition: "background 0.15s",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              flexShrink: 0,
              background: isCompleted ? "#86efac" : C.brand,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: isCompleted ? C.goodText : C.white,
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {isCompleted ? "✓" : week.week}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: C.text,
                margin: 0,
              }}
            >
              Week {week.week}: {week.title}
            </p>
            <p
              style={{
                fontSize: 12,
                color: C.dimmed,
                margin: "2px 0 0",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {week.topics?.slice(0, 3).join("  •  ")}
            </p>
          </div>

          {isCompleted && (
            <Badge color={C.good} text={C.goodText}>
              Completed
            </Badge>
          )}
          <span style={{ color: C.dimmed, fontSize: 16, flexShrink: 0 }}>
            {open ? "▲" : "▼"}
          </span>
        </div>

        {/* Expanded content */}
        {open && (
          <div
            style={{
              padding: "0 18px 18px",
              borderTop: `1px solid ${C.border}`,
            }}
          >
            <div
              style={{
                paddingTop: 14,
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              {/* Topics */}
              <div>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: C.dimmed,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    marginBottom: 8,
                  }}
                >
                  Topics
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {week.topics?.map((t) => (
                    <div
                      key={t}
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <Badge>{t}</Badge>
                      <button
                        onClick={() => onExplain(week.week, t)}
                        title="Explain Like I'm Stuck"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: 14,
                          padding: 0,
                          color: C.muted,
                        }}
                      >
                        💡
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestone */}
              {week.milestone && (
                <div
                  style={{
                    background: C.brandPale,
                    borderRadius: 8,
                    padding: "10px 14px",
                    fontSize: 13,
                    color: C.muted,
                  }}
                >
                  🎯 <b>Milestone:</b> {week.milestone}
                </div>
              )}
              {/* Resources */}
              {week.resources?.filter((r) => r.type !== "course").length >
                0 && (
                <div>
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: C.dimmed,
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      marginBottom: 8,
                    }}
                  >
                    Resources
                  </p>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 5 }}
                  >
                    {week.resources?.map((r, i) => (
                      <a
                        key={i}
                        href={r.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          fontSize: 13,
                          color: C.brand,
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <Badge color="#f0fdf4" text={C.brand}>
                          {r.type?.toUpperCase() || "LINK"}
                        </Badge>
                        {r.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Quiz button */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: 4,
                }}
              >
                <Btn
                  onClick={loadQuiz}
                  disabled={quizLoading || isCompleted}
                  small
                >
                  {quizLoading
                    ? "Generating Quiz…"
                    : isCompleted
                      ? "✓ Quiz Done"
                      : "📝 Take Quiz"}
                </Btn>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function ReshuffleBanner({ message, onDone }) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0b3d1f, #1a6b3c)",
        borderRadius: 12,
        padding: "16px 20px",
        marginBottom: 16,
        display: "flex",
        alignItems: "center",
        gap: 14,
        boxShadow: "0 4px 20px rgba(26,107,60,0.25)",
      }}
    >
      <div style={{ fontSize: 28 }}>🔄</div>
      <div style={{ flex: 1 }}>
        <p
          style={{ fontSize: 13, fontWeight: 700, color: "#4ade80", margin: 0 }}
        >
          Path Adapted!
        </p>
        <p
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.8)",
            margin: "2px 0 0",
          }}
        >
          {message}
        </p>
      </div>
      <button
        onClick={() => {
          setVisible(false);
          onDone?.();
        }}
        style={{
          background: "rgba(255,255,255,0.15)",
          border: "none",
          color: "#fff",
          borderRadius: 6,
          padding: "4px 10px",
          fontSize: 12,
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        Got it
      </button>
    </div>
  );
}

export default function PathDetail({ path: initialPath, token, onBack }) {
  const [path, setPath] = useState(initialPath);
  const [completedWeeks, setCompletedWeeks] = useState([]);
  const [quizHistory, setQuizHistory] = useState([]);
  const [reshuffleMsg, setReshuffleMsg] = useState(null);
  const [explainState, setExplainState] = useState(null);

  const pj = path.path_json || {};
  const weeks = pj.weeks || [];

  useEffect(() => {
    api(`/learning/path/${path.id}/progress`, token)
      .then((data) => {
        if (data.completed_weeks) setCompletedWeeks(data.completed_weeks);
        if (data.quiz_history) setQuizHistory(data.quiz_history);
      })
      .catch(console.error);
  }, [path.id]);

  const saveProgress = (newCompletedWeeks, newQuizHistory) => {
    api(`/learning/path/${path.id}/progress`, token, {
      method: "POST",
      body: JSON.stringify({
        completed_weeks: newCompletedWeeks,
        quiz_history: newQuizHistory,
      }),
    }).catch(console.error);
  };

  const handleQuizComplete = (weekNumber, result) => {
    const newCompleted = [...new Set([...completedWeeks, weekNumber])];
    const newHistory = [...quizHistory, { weekNumber, ...result }];

    setCompletedWeeks(newCompleted);
    setQuizHistory(newHistory);
    saveProgress(newCompleted, newHistory);

    if (result.reshuffled) {
      setPath((p) => ({ ...p, path_json: result.path_json }));
      setReshuffleMsg(result.message);
    }
  };

  const handleExplain = async (weekNumber, topic) => {
    setExplainState({ weekNumber, topic, loading: true, text: "" });
    try {
      const res = await api(`/learning/${path.id}/explain`, token, {
        method: "POST",
        body: JSON.stringify({
          week_number: weekNumber,
          topic,
          quiz_history: quizHistory.map((q) => ({
            weak_topics: q.weak_topics || [],
          })),
        }),
      });
      setExplainState({
        weekNumber,
        topic,
        loading: false,
        text: res.explanation,
      });
    } catch (e) {
      setExplainState((s) => ({
        ...s,
        loading: false,
        text: "Failed to load explanation. Please try again.",
      }));
    }
  };

  return (
    <>
      {explainState && (
        <ExplainModal
          topic={explainState.topic}
          explanation={explainState.text}
          loading={explainState.loading}
          onClose={() => setExplainState(null)}
        />
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={onBack}
            style={{
              background: C.brandPale,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: "6px 12px",
              fontSize: 13,
              color: C.brand,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            ← Back
          </button>
          <div style={{ flex: 1 }}>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: C.text,
                margin: 0,
              }}
            >
              {pj.title || path.goal}
            </h2>
            <p style={{ fontSize: 13, color: C.dimmed, margin: "2px 0 0" }}>
              {pj.duration_weeks || weeks.length} weeks •{" "}
              {completedWeeks.length} / {weeks.length} completed
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div
          style={{
            background: C.brandPale,
            borderRadius: 99,
            height: 8,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${weeks.length ? (completedWeeks.length / weeks.length) * 100 : 0}%`,
              height: "100%",
              background: C.brand,
              borderRadius: 99,
              transition: "width 0.5s ease",
            }}
          />
        </div>

        {/* Reshuffle banner */}
        {reshuffleMsg && (
          <ReshuffleBanner
            message={reshuffleMsg}
            onDone={() => setReshuffleMsg(null)}
          />
        )}

        {/* Week cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {weeks.map((w) => (
            <WeekCard
              key={`${w.week}-${JSON.stringify(w.topics)}`}
              week={w}
              pathId={path.id}
              token={token}
              quizHistory={quizHistory}
              completedWeeks={completedWeeks}
              onQuizComplete={handleQuizComplete}
              onExplain={handleExplain}
            />
          ))}
        </div>
      </div>
    </>
  );
}
