import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-oxc";
import { join } from "path";
import { defineConfig, withFilter } from "vite";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    withFilter(svgr(), { load: { id: /\.svg$/ } }),
  ],
  resolve: {
    alias: {
      "~": join(__dirname, "src"),
    },
  },
  server: {
    host: true,
    allowedHosts: true,
  },
});
