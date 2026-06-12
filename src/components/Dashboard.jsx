import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/learning";
import PathDetail from "./PathDetail";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getMe } from "../api/auth";
import { getDashboard, deletePath } from "../api/learning";

const C = {
  brand: "#1a6b3c",
  brandLight: "#2d9c5c",
  brandPale: "#e8f5ee",
  sidebarBg: "#0f2d1e",
  sidebarHover: "#1a4a2e",
  sidebarActive: "#1a6b3c",
  white: "#ffffff",
  cardBorder: "#daeee3",
  textPrimary: "#1a2e22",
  textSecond: "#4a7a5c",
  textMuted: "#7aaa8a",
};

const IMGS = {
  paths:
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80",
  skills:
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80",
  active:
    "https://images.unsplash.com/photo-1484807352052-23338990c6c6?w=400&q=80",
  resources:
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80",
  genPath:
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80",
  goals:
    "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=600&q=80",
  browse:
    "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&q=80",
  track: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
};

const INIT_TASKS = [
  {
    id: 1,
    text: "Complete Chapter 6: Stacks & Queues",
    done: true,
    badge: "Done",
    bc: "#d1fae5",
    bt: "#065f46",
  },
  {
    id: 2,
    text: "Submit Quiz: Recursion Basics",
    done: true,
    badge: "Done",
    bc: "#d1fae5",
    bt: "#065f46",
  },
  {
    id: 3,
    text: "Watch: Binary Trees Lecture",
    done: false,
    badge: "In progress",
    bc: "#dbeafe",
    bt: "#1e40af",
  },
  {
    id: 4,
    text: "Attempt Mock Test #5",
    done: false,
    badge: "Due tomorrow",
    bc: "#fef3c7",
    bt: "#92400e",
  },
  {
    id: 5,
    text: "Read: Graph Algorithms PDF",
    done: false,
    badge: "Pending",
    bc: "#f3f4f6",
    bt: "#374151",
  },
];

const NAV = [
  { id: "overview", label: "Overview", icon: "⊞" },
  { id: "progress", label: "View Progress", icon: "◈" },
  { id: "paths", label: "My Paths", icon: "⇢" },
  { id: "tasks", label: "Tasks", icon: "✓" },
  { id: "resources", label: "Resources", icon: "⊟" },
  { id: "profile", label: "Profile", icon: "◉" },
];

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth < breakpoint,
  );
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [breakpoint]);
  return isMobile;
}

function getInitials(name = "") {
  return (
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?"
  );
}
function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function MetricCard({ label, value, delta, positive, img }) {
  return (
    <div
      style={{
        background: C.white,
        border: `1px solid ${C.cardBorder}`,
        borderRadius: 14,
        flex: 1,
        minWidth: 0,
        overflow: "hidden",
      }}
    >
      {img && (
        <img
          src={img}
          alt={label}
          style={{
            width: "100%",
            height: 90,
            objectFit: "cover",
            display: "block",
          }}
        />
      )}
      <div style={{ padding: "14px 18px" }}>
        <p
          style={{
            fontSize: 11,
            color: C.textMuted,
            marginBottom: 4,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          {label}
        </p>
        <p
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: C.textPrimary,
            margin: 0,
          }}
        >
          {value}
        </p>
        {delta && (
          <p
            style={{
              fontSize: 12,
              marginTop: 4,
              color: positive ? "#059669" : "#dc2626",
            }}
          >
            {positive ? "▲" : "▼"} {delta}
          </p>
        )}
      </div>
    </div>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <h2
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: C.textPrimary,
          margin: 0,
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p style={{ fontSize: 14, color: C.textSecond, marginTop: 4 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

function ChartCard({ title, children, extra }) {
  return (
    <div
      style={{
        background: C.white,
        border: `1px solid ${C.cardBorder}`,
        borderRadius: 16,
        padding: "20px 24px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <h3
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: C.textPrimary,
            margin: 0,
          }}
        >
          {title}
        </h3>
        {extra}
      </div>
      {children}
    </div>
  );
}

function AddTaskModal({ onAdd, onClose }) {
  const [text, setText] = useState("");
  const [badge, setBadge] = useState("Pending");
  const isMobile = useIsMobile();
  const BADGE_OPTIONS = [
    { label: "Pending", bc: "#f3f4f6", bt: "#374151" },
    { label: "In progress", bc: "#dbeafe", bt: "#1e40af" },
    { label: "Due tomorrow", bc: "#fef3c7", bt: "#92400e" },
    { label: "Urgent", bc: "#fee2e2", bt: "#991b1b" },
  ];
  const chosen =
    BADGE_OPTIONS.find((b) => b.label === badge) || BADGE_OPTIONS[0];
  const handleAdd = () => {
    if (!text.trim()) return;
    onAdd({
      text: text.trim(),
      badge: chosen.label,
      bc: chosen.bc,
      bt: chosen.bt,
    });
    onClose();
  };
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: isMobile ? "flex-end" : "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.white,
          borderRadius: isMobile ? "18px 18px 0 0" : 18,
          padding: "28px 28px 24px",
          width: isMobile ? "100%" : 420,
          boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h3
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: C.textPrimary,
              margin: 0,
            }}
          >
            Add New Task
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: 20,
              cursor: "pointer",
              color: C.textMuted,
            }}
          >
            ×
          </button>
        </div>
        <label
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: C.textSecond,
            display: "block",
            marginBottom: 6,
          }}
        >
          Task description
        </label>
        <textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder="e.g. Watch: Sorting Algorithms lecture"
          rows={3}
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 10,
            border: `1.5px solid ${C.cardBorder}`,
            fontSize: 14,
            color: C.textPrimary,
            resize: "none",
            outline: "none",
            fontFamily: "inherit",
            boxSizing: "border-box",
          }}
          onFocus={(e) => (e.target.style.borderColor = C.brand)}
          onBlur={(e) => (e.target.style.borderColor = C.cardBorder)}
        />
        <label
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: C.textSecond,
            display: "block",
            margin: "14px 0 8px",
          }}
        >
          Status
        </label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {BADGE_OPTIONS.map((b) => (
            <button
              key={b.label}
              onClick={() => setBadge(b.label)}
              style={{
                padding: "5px 14px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                background: badge === b.label ? b.bc : "#f9f9f9",
                color: badge === b.label ? b.bt : C.textMuted,
                border:
                  badge === b.label
                    ? `1.5px solid ${b.bt}40`
                    : `1px solid ${C.cardBorder}`,
              }}
            >
              {b.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: 10,
              border: `1px solid ${C.cardBorder}`,
              background: "transparent",
              color: C.textSecond,
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!text.trim()}
            style={{
              flex: 2,
              padding: "10px",
              borderRadius: 10,
              border: "none",
              background: text.trim() ? C.brand : C.cardBorder,
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              cursor: text.trim() ? "pointer" : "not-allowed",
            }}
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
}

function Overview({ setActive, user, pathCount, skillCount, resourceCount }) {
  const isMobile = useIsMobile();
  const firstName = user?.name?.split(" ")[0] || "there";
  const initials = getInitials(user?.name);
  const daysActive = user?.created_at
    ? Math.max(
        1,
        Math.floor(
          (Date.now() - new Date(user.created_at).getTime()) / 86400000,
        ),
      )
    : 1;

  const stats = [
    {
      label: "Paths Generated",
      value: String(pathCount),
      img: "https://tse2.mm.bing.net/th/id/OIP.vZJV8bUrTrYMufLO-Xg16wHaE8?cb=thfvnextfalcon2&rs=1&pid=ImgDetMain&o=7&rm=3",
    },
    {
      label: "Skills Tracked",
      value: String(skillCount ?? 0),
      img: IMGS.skills,
    },
    { label: "Days Active", value: String(daysActive), img: IMGS.active },
    {
      label: "Resources Saved",
      value: String(resourceCount ?? 0),
      img: IMGS.resources,
    },
  ];
  const quickActions = [
    {
      label: "Generate a Learning Path",
      desc: "Create your personalized roadmap",
      img: IMGS.genPath,
      target: "paths",
    },
    {
      label: "Update Your Goals",
      desc: "Refine what you're working toward",
      img: IMGS.goals,
      target: "tasks",
    },
    {
      label: "Browse Resources",
      desc: "Explore curated learning material",
      img: IMGS.browse,
      target: "resources",
    },
    {
      label: "Track a New Skill",
      desc: "Add skills to your profile",
      img: IMGS.track,
      target: "progress",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <SectionTitle
        title={`Welcome back, ${firstName} `}
        subtitle="Here's an overview of your learning journey."
      />

      {/* Stats grid: 2 cols on mobile, 4 on desktop */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
          gap: 12,
        }}
      >
        {stats.map((s) => (
          <MetricCard
            key={s.label}
            label={s.label}
            value={s.value}
            img={s.img}
          />
        ))}
      </div>

      {/* Profile + Quick Actions: stack on mobile */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: 16,
        }}
      >
        {/* Profile card */}
        <div
          style={{
            background: C.white,
            border: `1px solid ${C.cardBorder}`,
            borderRadius: 16,
            padding: "20px 24px",
          }}
        >
          <p
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: C.brand,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 16,
            }}
          >
            Your Profile
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: C.brand,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 700,
                fontSize: 16,
                flexShrink: 0,
              }}
            >
              {initials}
            </div>
            <div>
              <p
                style={{
                  fontWeight: 600,
                  fontSize: 16,
                  color: C.textPrimary,
                  margin: 0,
                }}
              >
                {user?.name || "—"}
              </p>
              <p style={{ fontSize: 13, color: C.textMuted, margin: 0 }}>
                {user?.email || "—"}
              </p>
            </div>
          </div>
          {[
            ["Name", user?.name || "—"],
            ["Email", user?.email || "—"],
            ["Member Since", formatDate(user?.created_at)],
          ].map(([k, v]) => (
            <div
              key={k}
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderTop: `1px solid ${C.cardBorder}`,
                padding: "10px 0",
                fontSize: 14,
                gap: 8,
              }}
            >
              <span style={{ color: C.textMuted, flexShrink: 0 }}>{k}</span>
              <span
                style={{
                  fontWeight: 500,
                  color: C.textPrimary,
                  textAlign: "right",
                  wordBreak: "break-all",
                }}
              >
                {v}
              </span>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div
          style={{
            background: C.white,
            border: `1px solid ${C.cardBorder}`,
            borderRadius: 16,
            padding: "20px 24px",
          }}
        >
          <p
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: C.brand,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 14,
            }}
          >
            Quick Actions
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {quickActions.map((a) => (
              <button
                key={a.label}
                onClick={() => setActive(a.target)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: 0,
                  overflow: "hidden",
                  background: C.brandPale,
                  border: `1px solid ${C.cardBorder}`,
                  borderRadius: 10,
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                  transition: "transform 0.12s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.01)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(26,107,60,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <img
                  src={a.img}
                  alt=""
                  style={{
                    width: 52,
                    height: 52,
                    objectFit: "cover",
                    flexShrink: 0,
                  }}
                />
                <div style={{ padding: "0 10px 0 0", flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: C.textPrimary,
                      margin: 0,
                    }}
                  >
                    {a.label}
                  </p>
                  <p style={{ fontSize: 11, color: C.textMuted, margin: 0 }}>
                    {a.desc}
                  </p>
                </div>
                <span
                  style={{
                    marginLeft: "auto",
                    paddingRight: 12,
                    color: C.brand,
                    fontSize: 18,
                    flexShrink: 0,
                  }}
                >
                  ›
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Progress({ token }) {
  const [tab, setTab] = useState("score");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!token) return;
    fetch(`http://localhost:8000/learning/progress/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  const tabStyle = (t) => ({
    padding: "5px 14px",
    fontSize: 13,
    borderRadius: 8,
    cursor: "pointer",
    border: `1px solid ${tab === t ? C.brand : C.cardBorder}`,
    background: tab === t ? C.brand : "transparent",
    color: tab === t ? "#fff" : C.textSecond,
    fontWeight: tab === t ? 600 : 400,
  });

  if (loading)
    return (
      <div style={{ padding: 40, textAlign: "center", color: C.textMuted }}>
        Loading progress…
      </div>
    );

  const weeklyScoresLive = stats?.weekly_scores?.length
    ? stats.weekly_scores
    : [{ week: "No data", score: 0, target: 80 }];
  const topicCompletionLive = stats?.topic_completion?.length
    ? stats.topic_completion
    : [];
  const radarLive = stats?.topic_completion?.length
    ? stats.topic_completion.map((t) => ({ skill: t.topic, value: t.pct }))
    : [{ skill: "No data", value: 0 }];
  const avgScore = stats?.avg_score ?? 0;
  const lessonsDone = stats?.lessons_done ?? 0;
  const totalLessons = stats?.total_lessons ?? 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <SectionTitle
        title="Your Progress"
        subtitle="Analytics across all your learning paths."
      />

      {/* Metric cards: 2x2 on mobile, 4 cols on desktop */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
          gap: 12,
        }}
      >
        <MetricCard
          label="Avg Score"
          value={avgScore ? `${avgScore}%` : "—"}
          delta={
            avgScore
              ? `across ${stats.weekly_scores?.length || 0} quizzes`
              : "No quizzes yet"
          }
          positive={avgScore >= 70}
        />
        <MetricCard
          label="Weeks Done"
          value={lessonsDone || "0"}
          delta={totalLessons ? `of ${totalLessons} total` : "No paths yet"}
          positive={lessonsDone > 0}
        />
        <MetricCard
          label="Paths Active"
          value={stats?.topic_completion?.length || "0"}
          delta="learning paths"
          positive
        />
        <MetricCard
          label="Completion"
          value={
            totalLessons
              ? `${Math.round((lessonsDone / totalLessons) * 100)}%`
              : "0%"
          }
          delta="overall progress"
          positive={lessonsDone > 0}
        />
      </div>

      <ChartCard
        title="Weekly Trend"
        extra={
          <div style={{ display: "flex", gap: 6 }}>
            {[
              ["score", "Score"],
              ["skills", "Skills"],
            ].map(([t, l]) => (
              <button key={t} style={tabStyle(t)} onClick={() => setTab(t)}>
                {l}
              </button>
            ))}
          </div>
        }
      >
        <ResponsiveContainer width="100%" height={isMobile ? 180 : 220}>
          {tab === "score" ? (
            <LineChart data={weeklyScoresLive}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8f5ee" />
              <XAxis
                dataKey="week"
                tick={{ fontSize: 11, fill: C.textMuted }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: C.textMuted }}
                unit="%"
                width={36}
              />
              <Tooltip formatter={(v) => v + "%"} />
              <Legend />
              <Line
                type="monotone"
                dataKey="score"
                stroke={C.brand}
                strokeWidth={2.5}
                dot={{ r: 4 }}
                name="Your Score"
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke={C.brandLight}
                strokeWidth={1.5}
                strokeDasharray="6 4"
                dot={false}
                name="Target"
              />
            </LineChart>
          ) : (
            <RadarChart data={radarLive} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="#e8f5ee" />
              <PolarAngleAxis
                dataKey="skill"
                tick={{ fontSize: 11, fill: C.textMuted }}
              />
              <Radar
                name="Skill"
                dataKey="value"
                stroke={C.brand}
                fill={C.brand}
                fillOpacity={0.25}
              />
              <Tooltip />
            </RadarChart>
          )}
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Completion by Path">
        {topicCompletionLive.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "32px 0",
              color: C.textMuted,
              fontSize: 14,
            }}
          >
            Complete weeks in your paths to see progress here.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {topicCompletionLive.map((t) => (
              <div key={t.topic}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <span style={{ fontSize: 13, color: C.textPrimary }}>
                    {t.topic}
                  </span>
                  <span
                    style={{ fontSize: 13, fontWeight: 600, color: C.brand }}
                  >
                    {t.pct}%
                  </span>
                </div>
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
                      width: `${t.pct}%`,
                      height: "100%",
                      background: C.brand,
                      borderRadius: 99,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </ChartCard>
    </div>
  );
}

function TaskRow({ t, toggle, remove }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "13px 16px",
        background: C.white,
        border: `1px solid ${C.cardBorder}`,
        borderRadius: 12,
        boxShadow: hovered ? "0 2px 10px rgba(26,107,60,0.08)" : "none",
      }}
    >
      <div
        onClick={() => toggle(t.id)}
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          flexShrink: 0,
          cursor: "pointer",
          border: `2px solid ${t.done ? C.brand : C.cardBorder}`,
          background: t.done ? C.brand : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {t.done && <span style={{ color: "#fff", fontSize: 10 }}>✓</span>}
      </div>
      <span
        onClick={() => toggle(t.id)}
        style={{
          flex: 1,
          fontSize: 14,
          cursor: "pointer",
          color: t.done ? C.textMuted : C.textPrimary,
          textDecoration: t.done ? "line-through" : "none",
          minWidth: 0,
        }}
      >
        {t.text}
      </span>
      <span
        style={{
          fontSize: 11,
          padding: "3px 10px",
          borderRadius: 20,
          background: t.bc,
          color: t.bt,
          fontWeight: 500,
          flexShrink: 0,
          display: "none",
        }}
        ref={(el) => {
          if (el)
            el.style.display = window.innerWidth < 480 ? "none" : "inline";
        }}
      >
        {t.badge}
      </span>
      <button
        onClick={() => remove(t.id)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#dc2626",
          fontSize: 16,
          padding: "0 2px",
          flexShrink: 0,
          opacity: hovered ? 1 : 0.3,
          transition: "opacity 0.15s",
        }}
      >
        ×
      </button>
    </div>
  );
}

function Tasks() {
  const [items, setItems] = useState(INIT_TASKS);
  const [showModal, setModal] = useState(false);
  const [nextId, setNextId] = useState(INIT_TASKS.length + 1);
  const isMobile = useIsMobile();

  const toggle = (id) =>
    setItems((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              done: !t.done,
              badge: !t.done ? "Done" : "Pending",
              bc: !t.done ? "#d1fae5" : "#f3f4f6",
              bt: !t.done ? "#065f46" : "#374151",
            }
          : t,
      ),
    );
  const remove = (id) => setItems((prev) => prev.filter((t) => t.id !== id));
  const handleAdd = ({ text, badge, bc, bt }) => {
    setItems((prev) => [
      ...prev,
      { id: nextId, text, done: false, badge, bc, bt },
    ]);
    setNextId((n) => n + 1);
  };

  const done = items.filter((t) => t.done);
  const pending = items.filter((t) => !t.done);

  return (
    <>
      {showModal && (
        <AddTaskModal onAdd={handleAdd} onClose={() => setModal(false)} />
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: isMobile ? "center" : "flex-end",
            gap: 12,
          }}
        >
          <SectionTitle
            title="My Tasks"
            subtitle={`${pending.length} pending · ${done.length} completed`}
          />
          <button
            onClick={() => setModal(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 18px",
              background: C.brand,
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              flexShrink: 0,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = C.brandLight)
            }
            onMouseLeave={(e) => (e.currentTarget.style.background = C.brand)}
          >
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>{" "}
            {isMobile ? "Add" : "Add Task"}
          </button>
        </div>
        {items.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "48px 32px",
              background: C.white,
              border: `2px dashed ${C.cardBorder}`,
              borderRadius: 16,
            }}
          >
            <p style={{ fontSize: 36, marginBottom: 8 }}>✓</p>
            <p style={{ fontSize: 15, fontWeight: 600, color: C.textPrimary }}>
              All caught up!
            </p>
          </div>
        )}
        {pending.length > 0 && (
          <div>
            <p
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: C.textMuted,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 8,
              }}
            >
              Pending
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {pending.map((t) => (
                <TaskRow key={t.id} t={t} toggle={toggle} remove={remove} />
              ))}
            </div>
          </div>
        )}
        {done.length > 0 && (
          <div>
            <p
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: C.textMuted,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 8,
              }}
            >
              Completed
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {done.map((t) => (
                <TaskRow key={t.id} t={t} toggle={toggle} remove={remove} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function Paths({ user }) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPath, setSelectedPath] = useState(null);
  const token = localStorage.getItem("np_token");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    getDashboard(token)
      .then((data) => {
        if (Array.isArray(data)) setPaths(data);
        else setError("Failed to load paths.");
      })
      .catch(() => setError("Failed to load paths."))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this learning path?")) return;
    await deletePath(id, token);
    setPaths((prev) => prev.filter((p) => p.id !== id));
    if (selectedPath?.id === id) setSelectedPath(null);
  };

  if (loading)
    return (
      <div style={{ padding: 40, textAlign: "center", color: C.textMuted }}>
        Loading your paths…
      </div>
    );
  if (selectedPath)
    return (
      <PathDetail
        path={selectedPath}
        token={token}
        onBack={() => setSelectedPath(null)}
      />
    );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <SectionTitle
          title="My Learning Paths"
          subtitle="Personalized roadmaps generated for you."
        />
        <button
          onClick={() => navigate("/generator")}
          style={{
            padding: "9px 18px",
            background: C.brand,
            color: "#fff",
            border: "none",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = C.brandLight)
          }
          onMouseLeave={(e) => (e.currentTarget.style.background = C.brand)}
        >
          {isMobile ? "+ New" : "+ Generate New"}
        </button>
      </div>

      {error && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#b91c1c",
            borderRadius: 10,
            padding: "12px 16px",
            fontSize: 14,
          }}
        >
          {error}
        </div>
      )}

      {paths.length === 0 ? (
        <div
          style={{
            background: C.white,
            border: `2px dashed ${C.cardBorder}`,
            borderRadius: 16,
            padding: "48px 32px",
            textAlign: "center",
          }}
        >
          <img
            src={IMGS.genPath}
            alt=""
            style={{
              width: 120,
              height: 80,
              objectFit: "cover",
              borderRadius: 10,
              marginBottom: 16,
            }}
          />
          <p style={{ fontSize: 16, fontWeight: 600, color: C.textPrimary }}>
            No paths generated yet
          </p>
          <p
            style={{
              fontSize: 14,
              color: C.textMuted,
              marginTop: 6,
              marginBottom: 20,
            }}
          >
            Create your first personalized learning roadmap
          </p>
          <button
            onClick={() => navigate("/generator")}
            style={{
              padding: "10px 24px",
              background: C.brand,
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Generate a Learning Path
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {paths.map((p) => (
            <div
              key={p.id}
              style={{
                background: C.white,
                border: `1px solid ${C.cardBorder}`,
                borderRadius: 16,
                padding: "20px 24px",
                cursor: "pointer",
                transition: "box-shadow 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 4px 20px rgba(26,107,60,0.12)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              onClick={() => setSelectedPath(p)}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 12,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: C.textPrimary,
                      margin: "0 0 6px",
                    }}
                  >
                    {p.path_json?.title || p.goal}
                  </p>
                  <p
                    style={{
                      fontSize: 13,
                      color: C.textMuted,
                      margin: "0 0 10px",
                    }}
                  >
                    Goal: {p.goal}
                  </p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {p.path_json?.duration_weeks && (
                      <span
                        style={{
                          fontSize: 11,
                          padding: "3px 10px",
                          borderRadius: 20,
                          background: C.brandPale,
                          color: C.brand,
                          fontWeight: 500,
                        }}
                      >
                        {p.path_json.duration_weeks} weeks
                      </span>
                    )}
                    <span
                      style={{
                        fontSize: 11,
                        padding: "3px 10px",
                        borderRadius: 20,
                        background: "#f3f4f6",
                        color: C.textSecond,
                      }}
                    >
                      {formatDate(p.created_at)}
                    </span>
                    {!isMobile && (
                      <span
                        style={{
                          fontSize: 11,
                          padding: "3px 10px",
                          borderRadius: 20,
                          background: C.brandPale,
                          color: C.brand,
                          fontWeight: 500,
                        }}
                      >
                        Click to open →
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(p.id);
                  }}
                  style={{
                    background: "none",
                    border: "1px solid #fecaca",
                    color: "#dc2626",
                    borderRadius: 8,
                    padding: "6px 12px",
                    fontSize: 12,
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  {isMobile ? "✕" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Resources({ token }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    api("/learning/dashboard", token)
      .then((paths) => {
        const all = [];
        paths.forEach((path) => {
          const weeks = (path.path_json || {}).weeks || [];
          weeks.forEach((week) => {
            (week.resources || []).forEach((r) => {
              all.push({
                ...r,
                week: week.week,
                weekTitle: week.title,
                pathTitle: (path.path_json || {}).title || path.goal,
                pathId: path.id,
              });
            });
          });
        });
        setResources(all);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const typeIcon = { video: "📹", article: "📄", course: "🎓" };
  const typeColor = {
    video: "#fef3c7",
    article: C.brandPale,
    course: "#ede9fe",
  };
  const typeText = { video: "#92400e", article: C.brand, course: "#6d28d9" };
  const grouped = resources.reduce((acc, r) => {
    if (!acc[r.pathTitle]) acc[r.pathTitle] = [];
    acc[r.pathTitle].push(r);
    return acc;
  }, {});

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: 48, color: C.textMuted }}>
        Loading resources…
      </div>
    );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <SectionTitle
        title="Resources"
        subtitle="All learning materials across your paths."
      />
      {resources.length === 0 ? (
        <div
          style={{
            background: C.white,
            border: `2px dashed ${C.cardBorder}`,
            borderRadius: 16,
            padding: "48px 32px",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 16, fontWeight: 600, color: C.textPrimary }}>
            No resources yet
          </p>
          <p style={{ fontSize: 14, color: C.textMuted, marginTop: 6 }}>
            Generate a learning path to see resources here
          </p>
        </div>
      ) : (
        Object.entries(grouped).map(([pathTitle, items]) => (
          <div key={pathTitle}>
            <p
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: C.textMuted,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                marginBottom: 10,
              }}
            >
              {pathTitle}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {items.map((r, i) => (
                <a
                  key={i}
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    background: C.white,
                    border: `1px solid ${C.cardBorder}`,
                    borderRadius: 10,
                    padding: "12px 16px",
                    textDecoration: "none",
                    transition: "box-shadow 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.boxShadow =
                      "0 2px 12px rgba(0,0,0,0.08)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.boxShadow = "none")
                  }
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: 20,
                      background: typeColor[r.type] || C.brandPale,
                      color: typeText[r.type] || C.brand,
                      textTransform: "uppercase",
                      flexShrink: 0,
                    }}
                  >
                    {typeIcon[r.type] || "🔗"} {!isMobile && (r.type || "link")}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: C.textPrimary,
                      flex: 1,
                      minWidth: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {r.title}
                  </span>
                  {!isMobile && (
                    <span
                      style={{
                        fontSize: 11,
                        color: C.textMuted,
                        flexShrink: 0,
                      }}
                    >
                      Week {r.week}
                    </span>
                  )}
                  <span
                    style={{ color: C.textMuted, fontSize: 14, flexShrink: 0 }}
                  >
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function Profile({ user }) {
  const initials = getInitials(user?.name);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionTitle
        title="Profile"
        subtitle="Your NeuralPath account details."
      />
      <div
        style={{
          background: C.white,
          border: `1px solid ${C.cardBorder}`,
          borderRadius: 16,
          padding: "28px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            marginBottom: 28,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: C.brand,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: 22,
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <div>
            <p
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: C.textPrimary,
                margin: 0,
              }}
            >
              {user?.name || "—"}
            </p>
            <p style={{ fontSize: 14, color: C.textMuted, margin: "4px 0 0" }}>
              {user?.email || "—"}
            </p>
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${C.cardBorder}` }}>
          {[
            ["Full Name", user?.name || "—"],
            ["Email", user?.email || "—"],
            ["Member Since", formatDate(user?.created_at)],
          ].map(([k, v]) => (
            <div
              key={k}
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderBottom: `1px solid ${C.cardBorder}`,
                padding: "13px 0",
                fontSize: 14,
                gap: 12,
              }}
            >
              <span style={{ color: C.textMuted, flexShrink: 0 }}>{k}</span>
              <span
                style={{
                  fontWeight: 500,
                  color: C.textPrimary,
                  textAlign: "right",
                  wordBreak: "break-all",
                }}
              >
                {v}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [active, setActive] = useState("overview");
  const [user, setUser] = useState(null);
  const [pathCount, setPathCount] = useState(0);
  const [skillCount, setSkillCount] = useState(0);
  const [resourceCount, setResourceCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const token = localStorage.getItem("np_token");
    if (!token) {
      navigate("/login");
      return;
    }
    getMe(token)
      .then((data) => {
        if (data.id) setUser(data);
        else {
          localStorage.removeItem("np_token");
          navigate("/login");
        }
      })
      .catch(() => {
        localStorage.removeItem("np_token");
        navigate("/login");
      });
    getDashboard(token)
      .then((data) => {
        if (Array.isArray(data)) setPathCount(data.length);
      })
      .catch(() => {});
    const headers = { Authorization: `Bearer ${token}` };

    fetch("http://localhost:8000/skills/count", { headers })
      .then((r) => r.json())
      .then((d) => setSkillCount(d.count ?? 0))
      .catch(() => {});

    fetch("http://localhost:8000/resources/saved/count", { headers })
      .then((r) => r.json())
      .then((d) => setResourceCount(d.count ?? 0))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isMobile) setSidebarOpen(false);
  }, [isMobile]);

  useEffect(() => {
    document.body.style.overflow = isMobile && sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile, sidebarOpen]);

  const handleLogout = () => {
    localStorage.removeItem("np_token");
    navigate("/login");
  };
  const handleNavClick = (id) => {
    setActive(id);
    if (isMobile) setSidebarOpen(false);
  };

  const initials = getInitials(user?.name);
  const displayName = user?.name || "…";

  const renderSection = () => {
    switch (active) {
      case "overview":
        return (
          <Overview
            setActive={setActive}
            user={user}
            pathCount={pathCount}
            skillCount={skillCount}
            resourceCount={resourceCount}
          />
        );
      case "progress":
        return <Progress token={localStorage.getItem("np_token")} />;
      case "tasks":
        return <Tasks />;
      case "paths":
        return <Paths user={user} />;
      case "resources":
        return <Resources token={localStorage.getItem("np_token")} />;
      case "profile":
        return <Profile user={user} />;
      default:
        return (
          <Overview
            setActive={setActive}
            user={user}
            pathCount={pathCount}
            skillCount={skillCount}
            resourceCount={resourceCount}
          />
        );
    }
  };

  const SidebarContent = () => (
    <>
      {/* Logo + Home */}
      <div
        style={{
          padding: "24px 24px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <p style={{ fontSize: 20, fontWeight: 700, margin: "0 0 12px" }}>
          <span style={{ color: "#fff" }}>Neural</span>
          <span style={{ color: C.brandLight }}>Path</span>
        </p>
        <button
          onClick={() => navigate("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            width: "100%",
            padding: "8px 12px",
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            color: "rgba(255,255,255,0.7)",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.13)";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.07)";
            e.currentTarget.style.color = "rgba(255,255,255,0.7)";
          }}
        >
          Home
        </button>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "16px 12px" }}>
        <p
          style={{
            fontSize: 10,
            color: "rgba(255,255,255,0.3)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "0 12px",
            marginBottom: 8,
          }}
        >
          Main
        </p>
        {NAV.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                width: "100%",
                padding: "10px 14px",
                marginBottom: 2,
                background: isActive ? C.sidebarActive : "transparent",
                border: "none",
                borderRadius: 10,
                cursor: "pointer",
                color: isActive ? "#fff" : "rgba(255,255,255,0.55)",
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                textAlign: "left",
                borderLeft: isActive
                  ? `3px solid ${C.brandLight}`
                  : "3px solid transparent",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = C.sidebarHover;
                  e.currentTarget.style.color = "#fff";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "rgba(255,255,255,0.55)";
                }
              }}
            >
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User card */}
      <div
        style={{
          margin: "0 12px",
          padding: "14px",
          background: "rgba(255,255,255,0.06)",
          borderRadius: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: C.brand,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 12,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#fff",
                margin: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {displayName}
            </p>
            <p
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.4)",
                margin: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user?.email || "…"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            style={{
              marginLeft: "auto",
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.45)",
              cursor: "pointer",
              fontSize: 18,
              lineHeight: 1,
              padding: 4,
              borderRadius: 6,
              transition: "all 0.15s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#f87171";
              e.currentTarget.style.background = "rgba(239,68,68,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255,255,255,0.45)";
              e.currentTarget.style.background = "none";
            }}
          >
            ⏻
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        background: C.brandPale,
      }}
    >
      {/* ── Desktop sidebar ── */}
      {!isMobile && (
        <aside
          style={{
            width: 240,
            flexShrink: 0,
            background: C.sidebarBg,
            display: "flex",
            flexDirection: "column",
            padding: "0 0 24px",
          }}
        >
          <SidebarContent />
        </aside>
      )}

      {/* ── Mobile: top bar ── */}
      {isMobile && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 200,
            background: C.sidebarBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 16px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
          }}
        >
          <p style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
            <span style={{ color: "#fff" }}>Neural</span>
            <span style={{ color: C.brandLight }}>Path</span>
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>
              {NAV.find((n) => n.id === active)?.label}
            </span>
            <button
              onClick={() => setSidebarOpen((o) => !o)}
              aria-label="Toggle menu"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "none",
                borderRadius: 8,
                padding: "6px 10px",
                cursor: "pointer",
                color: "#fff",
                fontSize: 20,
                lineHeight: 1,
              }}
            >
              {sidebarOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      )}

      {/* ── Mobile: sidebar drawer ── */}
      {isMobile && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 198,
              background: "rgba(0,0,0,0.45)",
              opacity: sidebarOpen ? 1 : 0,
              pointerEvents: sidebarOpen ? "auto" : "none",
              transition: "opacity 0.25s",
            }}
          />
          {/* Drawer */}
          <aside
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              bottom: 0,
              zIndex: 199,
              width: 260,
              background: C.sidebarBg,
              display: "flex",
              flexDirection: "column",
              padding: "0 0 24px",
              transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
              transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
              boxShadow: sidebarOpen ? "4px 0 24px rgba(0,0,0,0.3)" : "none",
            }}
          >
            <SidebarContent />
          </aside>
        </>
      )}

      {/* ── Main content ── */}
      <main
        style={{
          flex: 1,
          overflowY: "auto",
          padding: isMobile ? "80px 16px 24px" : "36px 40px",
        }}
      >
        {renderSection()}
      </main>
    </div>
  );
}
