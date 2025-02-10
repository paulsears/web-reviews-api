import { coverageConfigDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.spec.ts"],
    coverage: {
      all: true,
      reporter: ["lcov", "text"],
      exclude: [
        ...coverageConfigDefaults.exclude,
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
