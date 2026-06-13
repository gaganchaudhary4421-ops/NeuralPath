const BASE = import.meta?.env?.VITE_API_BASE_URL || "https://localhost:8000";

export const signup = (data) =>
  fetch(`${BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const login = async (data) => {
  const r = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await r.json();
  if (json?.access_token) {
    localStorage.setItem("np_token", json.access_token);
  }
  return json;
};

export const forgotPassword = (email) =>
  fetch(`${BASE}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  }).then((r) => r.json());

export const getMe = (token) =>
  fetch(`${BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json());
