import { useState, useRef } from "react";
import { Player } from "@remotion/player";
import { LearningVideo, buildSequences } from "./remotion/LearningVideo";

export function VideoSection({ learningPath, videoScript }) {
  const [showVideo, setShowVideo] = useState(false);
  const sectionRef = useRef(null);

  const totalFrames = videoScript
    ? buildSequences(videoScript).totalFrames
    : 900;

  const handleShow = () => {
    setShowVideo(true);
    setTimeout(
      () =>
        sectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        }),
      150,
    );
  };

  return (
    <div ref={sectionRef} style={styles.wrapper}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.dot} />
          <span style={styles.headerLabel}>AI Explainer Video</span>
        </div>
        <span style={styles.headerSub}>
          Remotion-powered · topic-by-topic video breakdown
        </span>
      </div>

      {/* Not ready yet */}
      {!videoScript && (
        <div style={styles.notReadyBox}>
          <div style={styles.loadingIcon}>⏳</div>
          <p style={styles.loadingText}>
            Video script is being generated with your learning path…
          </p>
        </div>
      )}

      {/* Ready but not shown */}
      {videoScript && !showVideo && (
        <div style={styles.pregenerateBox}>
          <div style={styles.pregenerateIcon}>🎬</div>
          <h4 style={styles.pregenerateTitle}>Your Learning Video is Ready!</h4>
          <p style={styles.pregenerateDesc}>
            A personalized animated video explaining every topic in your path —
            with code examples, concept breakdowns, and a skill map.
          </p>
          <button style={styles.genBtn} onClick={handleShow}>
            ▶ Watch Your Learning Video
          </button>
        </div>
      )}

      {/* Remotion Player */}
      {videoScript && showVideo && (
        <div style={styles.playerWrapper}>
          <Player
            component={LearningVideo}
            inputProps={{ script: videoScript }}
            durationInFrames={totalFrames}
            compositionWidth={1280}
            compositionHeight={720}
            fps={30}
            style={styles.player}
            controls
            loop={false}
            clickToPlay
            doubleClickToFullscreen
            autoPlay
          />
          <div style={styles.playerHint}>
            Click to pause · Double-click for fullscreen ·{" "}
            {Math.round(totalFrames / 30)}s total
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    borderTop: "1px solid rgba(255,255,255,0.06)",
    padding: "2.5rem",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "0.5rem",
    marginBottom: "1.5rem",
  },
  headerLeft: { display: "flex", alignItems: "center", gap: "0.75rem" },
  dot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: "#f43f5e",
    boxShadow: "0 0 10px #f43f5e",
  },
  headerLabel: {
    fontSize: "0.73rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.7)",
  },
  headerSub: {
    fontSize: "0.75rem",
    color: "rgba(122,181,146,0.5)",
  },
  notReadyBox: {
    borderRadius: 20,
    padding: "2.5rem",
    background: "rgba(0,0,0,0.3)",
    border: "1px solid rgba(255,255,255,0.07)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: "0.75rem",
  },
  pregenerateBox: {
    borderRadius: 20,
    padding: "3rem 2rem",
    background: "rgba(0,0,0,0.3)",
    border: "1px solid rgba(255,255,255,0.07)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: "0.9rem",
  },
  pregenerateIcon: { fontSize: "2.5rem" },
  pregenerateTitle: {
    fontFamily: "inherit",
    fontSize: "1.3rem",
    fontWeight: 800,
    color: "#ffffff",
    margin: 0,
  },
  pregenerateDesc: {
    fontSize: "0.9rem",
    color: "rgba(122,181,146,0.7)",
    lineHeight: 1.7,
    maxWidth: "50ch",
    margin: 0,
  },
  genBtn: {
    marginTop: "0.5rem",
    background: "linear-gradient(135deg, #15803d 0%, #22c55e 100%)",
    color: "#fff",
    border: "none",
    padding: "0.9rem 2.5rem",
    borderRadius: 100,
    fontFamily: "inherit",
    fontSize: "1rem",
    fontWeight: 700,
    cursor: "pointer",
  },
  loadingIcon: { fontSize: "2rem" },
  loadingText: {
    color: "rgba(122,181,146,0.7)",
    fontSize: "0.9rem",
    margin: 0,
  },
  playerWrapper: { display: "flex", flexDirection: "column", gap: "0.75rem" },
  player: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
    aspectRatio: "16/9",
  },
  playerHint: {
    textAlign: "center",
    fontSize: "0.75rem",
    color: "rgba(122,181,146,0.45)",
  },
};
