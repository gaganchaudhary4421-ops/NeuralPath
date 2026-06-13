const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const signup = (data) =>
  fetch(`${BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const login = (data) =>
  fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());
export const forgotPassword = (email) =>
  fetch("${BASE}/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  }).then((r) => r.json());

export const getMe = (token) =>
  fetch(`${BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json());
