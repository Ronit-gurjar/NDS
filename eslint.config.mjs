// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Global ignore patterns for files that should not be linted at all
  {
    ignores: [
      "node_modules/",
      ".next/",
      "public/",
      "lib/generated/", // Add this line to ignore the entire Prisma generated folder
    ],
  },
  
  // Extend Next.js recommended configs
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Add custom rules or overrides here
  {
    rules: {
      // General ESLint rules
      "react/no-unescaped-entities": "error", // Keep this as error, requires fixing ' and " in JSX

      // TypeScript ESLint rules
      "@typescript-eslint/no-unused-vars": [
        "warn", // Change to "error" if you want strict checking, "warn" to allow
        { "argsIgnorePattern": "^_" } // Ignore unused variables starting with underscore (like `_req`)
      ],
      "@typescript-eslint/no-explicit-any": "warn", // Warn about 'any', but don't fail build for it
      "@typescript-eslint/no-empty-object-type": "warn", // Warn about empty object types, but don't fail
      "@typescript-eslint/no-require-imports": "off", // Often necessary to turn off for generated JS files if they use CommonJS requires
      "@typescript-eslint/prefer-as-const": "warn", // Suggest 'as const', but don't fail build
      
      // You can add more rules or override existing ones as needed
    }
  }
];

export default eslintConfig;