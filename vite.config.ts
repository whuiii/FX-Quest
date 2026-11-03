
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [
    // Automatically generates the route tree from src/routes/
    TanStackRouterVite({
      target: "react",
      autoCodeSplitting: true,
    }),

    // React support
    react(),

    // Tailwind CSS v4
    tailwindcss(),
  ],

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
