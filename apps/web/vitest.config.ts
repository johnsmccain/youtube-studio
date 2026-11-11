import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__dirname, "./src"),
      },
      // Mock Three.js — no WebGL in jsdom
      {
        find: "three",
        replacement: path.resolve(__dirname, "./src/__mocks__/three.ts"),
      },
      // Mock GSAP root import and all subpath imports (e.g. gsap/ScrollTrigger)
      {
        find: /^gsap(\/.*)?$/,
        replacement: path.resolve(__dirname, "./src/__mocks__/gsap.ts"),
      },
    ],
  },
});
