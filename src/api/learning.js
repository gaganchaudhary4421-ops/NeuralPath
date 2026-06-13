const BASE = "http://localhost:8000";

export const api = (path, token, opts = {}) =>
  fetch(`${BASE}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(opts.headers || {}),
    },
  }).then((r) => r.json());
export const generatePath = (data, token) =>
  fetch(`${BASE}/learning/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const generateVideoScript = (pathId, token) =>
  fetch(`${BASE}/learning/generate-video-script/${pathId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json());
export const getDashboard = (token) =>
  fetch(`${BASE}/learning/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json());
export const deletePath = (id, token) =>
  fetch(`${BASE}/path/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

// Search YouTube videos using the no-key embed trick
// fetchYouTubeVideos.js
export const fetchYouTubeVideos = async (query) => {
  const API_KEY = "AIzaSyAkKdTsgG8DD6eGRLJDXGeUCNiOty8jHr4";
  const searchQuery = encodeURIComponent(query);

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&type=video&maxResults=1&key=${API_KEY}`,
  );
  const data = await res.json();

  if (!data.items || data.items.length === 0) return [];

  const video = data.items[0];
  const videoId = video.id.videoId;

  return [
    {
      id: videoId,
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=0`,
      thumbnail: video.snippet.thumbnails.high.url,
    },
  ];
};
