"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeSwitch() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const next = saved ? saved === "dark" : prefersDark;
    requestAnimationFrame(() => setDark(next));
    document.documentElement.dataset.theme = next ? "dark" : "light";
  }, []);
  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    localStorage.setItem("theme", next ? "dark" : "light");
  }
  return <button className="icon-button" onClick={toggle} aria-label={`Switch to ${dark ? "light" : "dark"} theme`} title="Toggle theme">{dark ? <Sun size={18} /> : <Moon size={18} />}</button>;
}
