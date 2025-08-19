import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

async function getPlugins() {
  const plugins = [react()];

  // Only load Replit-specific plugins in Replit
  if (process.env.REPL_ID !== undefined) {
    const { runtimeErrorOverlay } = await import("@replit/vite-plugin-runtime-error-modal");
    plugins.push(runtimeErrorOverlay());

    if (process.env.NODE_ENV !== "production") {
      const { cartographer } = await import("@replit/vite-plugin-cartographer");
      plugins.push(cartographer());
    }
  }

  return plugins;
}

export default defineConfig(async () => ({
  plugins: await getPlugins(),
  resolve: {
    alias: {
      "@": path.resolve("./client/src"),
      "@shared": path.resolve("./shared"),
      "@assets": path.resolve("./attached_assets"),
    },
  },
  root: path.resolve("./client"),
  build: {
    outDir: path.resolve("./dist/public"),
    emptyOutDir: true,
    target: "esnext",
    rollupOptions: {
      output: {
        format: "esm"
      }
    }
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
}));
