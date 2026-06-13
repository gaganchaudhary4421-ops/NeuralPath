import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { login, signup, forgotPassword } from "../api/auth";

const DG = "#0b3d1f";
const DG2 = "#145a2e";
const DG3 = "#1a6e35";
const DG_LIGHT = "#e8f5ee";
const WHITE = "#ffffff";
const FONT = "'DM Sans', system-ui, sans-serif";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 640 : false,
  );
  if (typeof window !== "undefined") {
    window.addEventListener("resize", () => {
      setIsMobile(window.innerWidth < 640);
    });
  }
  return isMobile;
}

function MobileTopBar({ switchText, switchLabel, switchTo }) {
  return (
    <div
      style={{
        background: DG,
        padding: "1rem 1.25rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Link
        to="/"
        style={{
          fontSize: "1.25rem",
          fontWeight: 800,
          color: WHITE,
          letterSpacing: "-0.03em",
          textDecoration: "none",
        }}
      >
        Neural<span style={{ color: "#4ade80" }}>Path</span>
      </Link>
      <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.55)" }}>
        {switchText}{" "}
        <Link
          to={switchTo}
          style={{ color: "#4ade80", fontWeight: 600, textDecoration: "none" }}
        >
          {switchLabel}
        </Link>
      </div>
    </div>
  );
}

function Field({ label, type = "text", placeholder, value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.3rem",
        marginBottom: "1rem",
      }}
    >
      <label
        style={{
          fontSize: "0.78rem",
          fontWeight: 600,
          color: DG,
          letterSpacing: "0.02em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          padding: "0.6rem 0.85rem",
          border: `1.5px solid ${focused ? DG3 : "#d1e8db"}`,
          borderRadius: "8px",
          fontSize: "0.88rem",
          fontFamily: FONT,
          color: "#1a2e22",
          background: WHITE,
          outline: "none",
          width: "100%",
          boxShadow: focused ? "0 0 0 3px rgba(26,110,53,0.1)" : "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
          boxSizing: "border-box",
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}

function SubmitBtn({ children, onClick, loading }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={loading}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "100%",
        padding: "0.7rem",
        background: hov ? DG2 : DG,
        color: WHITE,
        border: "none",
        borderRadius: "100px",
        fontFamily: FONT,
        fontSize: "0.9rem",
        fontWeight: 700,
        cursor: loading ? "not-allowed" : "pointer",
        transition: "background 0.2s",
        marginTop: "0.25rem",
        opacity: loading ? 0.7 : 1,
      }}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}

function LeftPanel({
  title,
  sub,
  features,
  switchText,
  switchLabel,
  switchTo,
}) {
  return (
    <div
      style={{
        background: DG,
        flex: "0 0 42%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "2.5rem 2rem",
      }}
    >
      <Link
        to="/"
        style={{
          fontSize: "1.5rem",
          fontWeight: 800,
          color: WHITE,
          letterSpacing: "-0.03em",
          marginBottom: "2.5rem",
          textDecoration: "none",
        }}
      >
        Neural<span style={{ color: "#4ade80" }}>Path</span>
      </Link>
      <div
        style={{
          fontSize: "1.4rem",
          fontWeight: 700,
          color: WHITE,
          lineHeight: 1.3,
          marginBottom: "0.75rem",
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: "0.85rem",
          color: "rgba(255,255,255,0.6)",
          lineHeight: 1.6,
          marginBottom: "2rem",
        }}
      >
        {sub}
      </div>
      <ul
        style={{
          listStyle: "none",
          display: "flex",
          flexDirection: "column",
          gap: "0.6rem",
          padding: 0,
          margin: 0,
        }}
      >
        {features.map((f) => (
          <li
            key={f}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              fontSize: "0.82rem",
              color: "rgba(255,255,255,0.75)",
            }}
          >
            <span
              style={{
                width: 18,
                height: 18,
                background: "rgba(74,222,128,0.2)",
                border: "1px solid rgba(74,222,128,0.4)",
                borderRadius: "50%",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.65rem",
                color: "#4ade80",
                flexShrink: 0,
              }}
            >
              ✓
            </span>
            {f}
          </li>
        ))}
      </ul>
      <div
        style={{
          marginTop: "2rem",
          fontSize: "0.78rem",
          color: "rgba(255,255,255,0.45)",
        }}
      >
        {switchText}{" "}
        <Link
          to={switchTo}
          style={{ color: "#4ade80", fontWeight: 600, textDecoration: "none" }}
        >
          {switchLabel}
        </Link>
      </div>
    </div>
  );
}

function AuthCard({ isMobile, leftPanel, mobileBar, children }) {
  if (isMobile) {
    return (
      <div
        style={{
          minHeight: "100vh",
          fontFamily: FONT,
          background: "#f3f8f5",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {mobileBar}
        <div
          style={{
            flex: 1,
            background: WHITE,
            padding: "1.75rem 1.25rem 2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: FONT,
        background: "#f3f8f5",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          maxWidth: "860px",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 8px 40px rgba(11,61,31,0.13)",
          minHeight: "520px",
        }}
      >
        {leftPanel}
        <div
          style={{
            flex: 1,
            background: WHITE,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "2.5rem 2.2rem",
            minWidth: 0,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Login Page
export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.redirectTo || "/dashboard";
  const successMsg = location.state?.message || "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isMobile = useIsMobile();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await login({ email, password });
      if (data.detail) {
        setError(
          typeof data.detail === "string"
            ? data.detail
            : "Invalid email or password.",
        );
        return;
      }
      if (!data.access_token) {
        setError("Login failed — no token received. Please try again.");
        return;
      }
      localStorage.setItem("np_token", data.access_token);

      navigate("/dashboard", { replace: true });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formContent = (
    <>
      <div
        style={{
          fontSize: isMobile ? "1.1rem" : "1.25rem",
          fontWeight: 700,
          color: DG,
          marginBottom: "0.3rem",
        }}
      >
        Sign in to NeuralPath
      </div>
      <div
        style={{
          fontSize: "0.82rem",
          color: "#6b7280",
          marginBottom: "1.6rem",
        }}
      >
        Good to see you again.
      </div>

      {successMsg && (
        <div
          style={{
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            color: "#15803d",
            borderRadius: "8px",
            padding: "0.6rem 0.85rem",
            fontSize: "0.82rem",
            marginBottom: "1rem",
          }}
        >
          {successMsg}
        </div>
      )}
      {error && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#b91c1c",
            borderRadius: "8px",
            padding: "0.6rem 0.85rem",
            fontSize: "0.82rem",
            marginBottom: "1rem",
          }}
        >
          {error}
        </div>
      )}

      <Field
        label="Email address"
        type="email"
        placeholder="priya@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Field
        label="Password"
        type="password"
        placeholder="Your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Link
        to="/forgot-password"
        style={{
          fontSize: "0.75rem",
          color: DG3,
          textDecoration: "none",
          fontWeight: 500,
          display: "block",
          textAlign: "right",
          marginTop: "-0.4rem",
          marginBottom: "0.8rem",
        }}
      >
        Forgot your password?
      </Link>
      <SubmitBtn onClick={handleLogin} loading={loading}>
        Sign In →
      </SubmitBtn>

      {isMobile && (
        <div
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontSize: "0.82rem",
            color: "#6b7280",
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/signup"
            style={{ color: DG3, fontWeight: 600, textDecoration: "none" }}
          >
            Sign up free
          </Link>
        </div>
      )}
    </>
  );

  return (
    <AuthCard
      isMobile={isMobile}
      mobileBar={
        <MobileTopBar
          switchText="Don't have an account?"
          switchLabel="Sign up free"
          switchTo="/signup"
        />
      }
      leftPanel={
        <LeftPanel
          title="Welcome back, learner"
          sub="Pick up right where you left off. Your progress is waiting."
          features={[
            "Resume your learning path",
            "View streaks & achievements",
            "Access saved resources",
          ]}
          switchText="Don't have an account?"
          switchLabel="Sign up free"
          switchTo="/signup"
        />
      }
    >
      {formContent}
    </AuthCard>
  );
}

// ── Signup Page
export function SignupPage() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isMobile = useIsMobile();

  const handleSignup = async () => {
    if (!firstName || !lastName || !email || !password || !confirm) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await signup({
        name: `${firstName} ${lastName}`,
        email,
        password,
      });
      if (data.detail) {
        setError(
          typeof data.detail === "string"
            ? data.detail
            : "Signup failed. Please try again.",
        );
        return;
      }
      if (data.access_token) {
        localStorage.setItem("np_token", data.access_token);
        navigate("/dashboard", { replace: true });
        return;
      }
      navigate("/login", {
        replace: true,
        state: { message: "Account created! Please sign in." },
      });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formContent = (
    <>
      <div
        style={{
          fontSize: isMobile ? "1.1rem" : "1.25rem",
          fontWeight: 700,
          color: DG,
          marginBottom: "0.3rem",
        }}
      >
        Create your account
      </div>
      {!isMobile && (
        <div
          style={{
            fontSize: "0.82rem",
            color: "#6b7280",
            marginBottom: "1rem",
          }}
        >
          Join thousands mastering new skills.
        </div>
      )}
      {isMobile && (
        <div
          style={{
            fontSize: "0.82rem",
            color: "#6b7280",
            marginBottom: "1rem",
          }}
        >
          Join thousands mastering new skills.
        </div>
      )}

      {error && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#b91c1c",
            borderRadius: "8px",
            padding: "0.6rem 0.85rem",
            fontSize: "0.82rem",
            marginBottom: "1rem",
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.75rem",
        }}
      >
        <Field
          label="First name"
          placeholder="Priya"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <Field
          label="Last name"
          placeholder="Sharma"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      <Field
        label="Email address"
        type="email"
        placeholder="priya@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Field
        label="Password"
        type="password"
        placeholder="Min. 8 characters"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Field
        label="Confirm password"
        type="password"
        placeholder="Repeat password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />
      <SubmitBtn onClick={handleSignup} loading={loading}>
        Create Account →
      </SubmitBtn>

      {isMobile && (
        <div
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontSize: "0.82rem",
            color: "#6b7280",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{ color: DG3, fontWeight: 600, textDecoration: "none" }}
          >
            Sign in
          </Link>
        </div>
      )}
    </>
  );

  return (
    <AuthCard
      isMobile={isMobile}
      mobileBar={
        <MobileTopBar
          switchText="Already have an account?"
          switchLabel="Sign in"
          switchTo="/login"
        />
      }
      leftPanel={
        <LeftPanel
          title="Start your learning journey today"
          sub="Join thousands mastering new skills with AI-powered paths."
          features={[
            "Personalized learning paths",
            "AI-powered progress tracking and path generator",
            "Learn at your own pace",
          ]}
          switchText="Already have an account?"
          switchLabel="Sign in"
          switchTo="/login"
        />
      }
    >
      {formContent}
    </AuthCard>
  );
}

// ── Forgot Password Page
export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [hov, setHov] = useState(false);
  const isMobile = useIsMobile();

  const handleSubmit = async () => {
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await forgotPassword(email);
      if (data.detail && data.detail !== "ok") {
        setError(data.detail);
        return;
      }
      await new Promise((r) => setTimeout(r, 1000));
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const leftPanel = (
    <div
      style={{
        background: DG,
        flex: "0 0 42%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "2.5rem 2rem",
      }}
    >
      <Link
        to="/"
        style={{
          fontSize: "1.5rem",
          fontWeight: 800,
          color: WHITE,
          letterSpacing: "-0.03em",
          marginBottom: "2.5rem",
          textDecoration: "none",
        }}
      >
        Neural<span style={{ color: "#4ade80" }}>Path</span>
      </Link>
      <div
        style={{
          width: 56,
          height: 56,
          background: "rgba(74,222,128,0.15)",
          border: "1px solid rgba(74,222,128,0.3)",
          borderRadius: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1.5rem",
        }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <rect
            x="2"
            y="4"
            width="20"
            height="16"
            rx="3"
            stroke="#4ade80"
            strokeWidth="1.8"
          />
          <path
            d="M2 8l10 6 10-6"
            stroke="#4ade80"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div
        style={{
          fontSize: "1.4rem",
          fontWeight: 700,
          color: WHITE,
          lineHeight: 1.3,
          marginBottom: "0.75rem",
        }}
      >
        Forgot your password?
      </div>
      <div
        style={{
          fontSize: "0.85rem",
          color: "rgba(255,255,255,0.6)",
          lineHeight: 1.6,
          marginBottom: "2rem",
        }}
      >
        No worries — enter your email and we'll send you a reset link.
      </div>
      <ul
        style={{
          listStyle: "none",
          display: "flex",
          flexDirection: "column",
          gap: "0.6rem",
          padding: 0,
          margin: 0,
        }}
      >
        {[
          "Reset link sent within seconds",
          "Link expires after 15 minutes",
          "Your data stays safe",
        ].map((f) => (
          <li
            key={f}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              fontSize: "0.82rem",
              color: "rgba(255,255,255,0.75)",
            }}
          >
            <span
              style={{
                width: 18,
                height: 18,
                background: "rgba(74,222,128,0.2)",
                border: "1px solid rgba(74,222,128,0.4)",
                borderRadius: "50%",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.65rem",
                color: "#4ade80",
                flexShrink: 0,
              }}
            >
              ✓
            </span>
            {f}
          </li>
        ))}
      </ul>
      <div
        style={{
          marginTop: "2rem",
          fontSize: "0.78rem",
          color: "rgba(255,255,255,0.45)",
        }}
      >
        Remember it?{" "}
        <Link
          to="/login"
          style={{ color: "#4ade80", fontWeight: 600, textDecoration: "none" }}
        >
          Sign in
        </Link>
      </div>
    </div>
  );

  const rightContent = sent ? (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          width: 64,
          height: 64,
          background: DG_LIGHT,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 1.25rem",
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 13l4 4L19 7"
            stroke={DG3}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div
        style={{
          fontSize: "1.2rem",
          fontWeight: 700,
          color: DG,
          marginBottom: "0.5rem",
        }}
      >
        Check your inbox
      </div>
      <div
        style={{
          fontSize: "0.85rem",
          color: "#6b7280",
          lineHeight: 1.6,
          marginBottom: "1.75rem",
        }}
      >
        We've sent a password reset link to
        <br />
        <strong style={{ color: DG }}>{email}</strong>
      </div>
      <div
        style={{
          background: DG_LIGHT,
          border: "1px solid #c6e5d1",
          borderRadius: "10px",
          padding: "0.85rem 1rem",
          fontSize: "0.8rem",
          color: DG2,
          lineHeight: 1.6,
          marginBottom: "1.75rem",
          textAlign: "left",
        }}
      >
        <strong>Didn't receive it?</strong> Check your spam folder or{" "}
        <button
          onClick={() => {
            setSent(false);
            setEmail("");
          }}
          style={{
            background: "none",
            border: "none",
            color: DG3,
            fontWeight: 600,
            cursor: "pointer",
            padding: 0,
            fontSize: "0.8rem",
            fontFamily: FONT,
          }}
        >
          try a different email
        </button>
      </div>
      <Link
        to="/login"
        style={{
          display: "block",
          textAlign: "center",
          padding: "0.7rem",
          background: DG,
          color: WHITE,
          borderRadius: "100px",
          fontFamily: FONT,
          fontSize: "0.9rem",
          fontWeight: 700,
          textDecoration: "none",
        }}
      >
        Back to Sign In
      </Link>
    </div>
  ) : (
    <>
      <div
        style={{
          fontSize: isMobile ? "1.1rem" : "1.25rem",
          fontWeight: 700,
          color: DG,
          marginBottom: "0.3rem",
        }}
      >
        Reset your password
      </div>
      <div
        style={{
          fontSize: "0.82rem",
          color: "#6b7280",
          marginBottom: "1.8rem",
        }}
      >
        Enter the email linked to your account.
      </div>

      {error && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#b91c1c",
            borderRadius: "8px",
            padding: "0.6rem 0.85rem",
            fontSize: "0.82rem",
            marginBottom: "1rem",
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.3rem",
          marginBottom: "1.25rem",
        }}
      >
        <label
          style={{
            fontSize: "0.78rem",
            fontWeight: 600,
            color: DG,
            letterSpacing: "0.02em",
            textTransform: "uppercase",
          }}
        >
          Email address
        </label>
        <input
          type="email"
          placeholder="priya@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          style={{
            padding: "0.6rem 0.85rem",
            border: `1.5px solid ${focused ? DG3 : "#d1e8db"}`,
            borderRadius: "8px",
            fontSize: "0.88rem",
            fontFamily: FONT,
            color: "#1a2e22",
            background: WHITE,
            outline: "none",
            width: "100%",
            boxShadow: focused ? "0 0 0 3px rgba(26,110,53,0.1)" : "none",
            transition: "border-color 0.2s, box-shadow 0.2s",
            boxSizing: "border-box",
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          width: "100%",
          padding: "0.7rem",
          background: hov ? DG2 : DG,
          color: WHITE,
          border: "none",
          borderRadius: "100px",
          fontFamily: FONT,
          fontSize: "0.9rem",
          fontWeight: 700,
          cursor: loading ? "not-allowed" : "pointer",
          transition: "background 0.2s",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "Sending..." : "Send Reset Link →"}
      </button>

      <div style={{ textAlign: "center", marginTop: "1.25rem" }}>
        <Link
          to="/login"
          style={{
            fontSize: "0.82rem",
            color: DG3,
            textDecoration: "none",
            fontWeight: 500,
            display: "inline-flex",
            alignItems: "center",
            gap: "0.3rem",
          }}
        >
          ← Back to Sign In
        </Link>
      </div>
    </>
  );

  return (
    <AuthCard
      isMobile={isMobile}
      mobileBar={
        <MobileTopBar
          switchText="Remember it?"
          switchLabel="Sign in"
          switchTo="/login"
        />
      }
      leftPanel={leftPanel}
    >
      {rightContent}
    </AuthCard>
  );
}
