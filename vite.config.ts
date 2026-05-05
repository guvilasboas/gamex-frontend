import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      react: fileURLToPath(
        new URL("../../node_modules/react", import.meta.url),
      ),
      "react-dom": fileURLToPath(
        new URL("../../node_modules/react-dom", import.meta.url),
      ),
      jotai: fileURLToPath(
        new URL("../../node_modules/jotai", import.meta.url),
      ),
    },
    dedupe: ["react", "react-dom", "jotai"],
  },
  plugins: [react()],
});
