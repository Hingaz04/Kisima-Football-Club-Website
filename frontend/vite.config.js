import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Use polling instead of native file watching (useful if using WSL or remote environment)
      usePolling: true,
    },
    hmr: {
      // Auto-refresh the page when HMR fails
      overlay: true,
    },
  },
});
