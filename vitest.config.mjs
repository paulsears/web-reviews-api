/// <reference types="vitest" />
import { coverageConfigDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.spec.ts"],
    environment: "node",
    coverage: {
      all: true,
      reporter: ["lcov", "text"],
      exclude: [
        ...coverageConfigDefaults.exclude,
        "**/node_modules/**",
        "**/dist/**",
        "**/cypress/**",
        "**/.{idea,vscode,git,cache,output,temp}/**",
        "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*",
        "./src/main.ts",
        "./src/module/**/modules/**",
        "./src/module/example/**",
      ],
      thresholds: {
        lines: 20,
        functions: 20,
        branches: 20,
        statements: 20,
      },
    },
  },
});
