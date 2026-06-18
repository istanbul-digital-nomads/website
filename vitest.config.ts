import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/tests/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // `server-only` throws when imported outside an RSC; stub it so unit
      // tests can import pure helpers that live in server modules.
      "server-only": path.resolve(__dirname, "./src/tests/empty-module.ts"),
    },
  },
});
