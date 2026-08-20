import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { join } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "~": join(import.meta.dirname, "src"),
    },
  },
  server: {
    host: true,
    allowedHosts: true,
  },
});
