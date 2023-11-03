import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "user",
      filename: "user.js",
      // Modules to expose
      exposes: {
        "./User": "./src/App.tsx",
      },
      shared: ["react", "react-dom", "react-router-dom"],
    }),
  ],
  preview: {
    host: "localhost",
    port: 3002,
    strictPort: true,
  },
  server: {
    port: 3002,
  },
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});

