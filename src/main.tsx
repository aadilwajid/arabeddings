import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Initialize dark mode from localStorage before React renders to prevent flash
const stored = localStorage.getItem('bedding-store');
if (stored) {
  try {
    const parsed = JSON.parse(stored);
    if (parsed?.state?.darkMode) {
      document.documentElement.classList.add('dark');
    }
  } catch {}
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
