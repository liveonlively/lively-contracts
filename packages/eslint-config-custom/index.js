module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:svelte/recommended",
    "plugin:perfectionist/recommended-natural",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2020,
    extraFileExtensions: [".svelte"],
  },
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
  overrides: [
    {
      files: ["*.svelte"],
      parser: "svelte-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
      },
    },
  ],
  rules: {
    "@typescript-eslint/adjacent-overload-signatures": "error",
    "perfectionist/sort-classes": [
      "error",
      {
        groups: [
          "static-property",
          "private-property",
          "property",
          "constructor",
          "static-method",
          "private-method",
          "method",
        ],
        order: "asc",
        type: "natural",
      },
    ],
  },
};
