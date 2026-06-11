import { useEffect } from "react";

export default function Cursor() {
  useEffect(() => {
    const CLICKABLE =
      'button, a, [data-hover], input, select, textarea, label, [role="button"]';

    const onMove = (e) => {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      document.body.style.cursor = el?.closest(CLICKABLE)
        ? "pointer"
        : "default";
    };

    document.addEventListener("mousemove", onMove);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.body.style.cursor = "default";
    };
  }, []);

  return null;
}
