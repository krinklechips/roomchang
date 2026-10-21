import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "src"),
      "server-only": path.resolve(rootDir, "node_modules/next/dist/compiled/server-only/empty.js"),
    },
  },
  test: {
    environment: "jsdom",
    exclude: ["**/node_modules/**", "**/.next/**", "**/.claude/**", "**/.worktrees/**"],
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    // Transform Next Intl's extensionless Next imports through Vite, not Node ESM.
    server: { deps: { inline: ["next-intl"] } },
  },
});
