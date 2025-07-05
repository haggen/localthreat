import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { onCLS, onINP, onLCP } from "web-vitals";
import { App } from "~/components/app";

import "resetize";
import "./global.css";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root container not found");
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>
);

onLCP(console.log);
onINP(console.log);
onCLS(console.log);
