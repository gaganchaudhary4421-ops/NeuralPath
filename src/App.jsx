import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Cursor from "./components/Cursor";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Features from "./components/Features";
import Generator from "./components/Generator";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";
import ThreeBackground from "./components/ThreeBackground";
import "./App.css";
import {
  LoginPage,
  SignupPage,
  ForgotPasswordPage,
} from "./components/Authpages";
import Dashboard from "./components/Dashboard";

function HomePage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0.1 },
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <ThreeBackground aria-hidden="true" />
      <div className="page">
        <Navbar />
        <section id="home" aria-label="Hero — Introduction">
          <Hero />
        </section>
        <section id="stats" aria-label="Platform statistics">
          <Stats />
        </section>
        <section id="features" aria-label="Platform features">
          <Features />
        </section>
        <Generator />
        <section id="how" aria-label="How NeuralPath works">
          <HowItWorks />
        </section>
        <Footer />
      </div>
    </>
  );
}

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("np_token");

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <>
      <Cursor aria-hidden="true" />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
