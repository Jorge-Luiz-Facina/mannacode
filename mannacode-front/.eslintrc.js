module.exports = {
  env: {
    node: true,
    browser: true,
    'es2021': true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      "modules": true,
      "experimentalObjectRestSpread": true
    },
    ecmaVersion: 2021,
    sourceType: "module",
  },
  plugins: ["react", "import", "react-hooks"],
  ignorePatterns: ["node_modules/"],
  rules: {
    "react/prop-types":  "error",
    "react/no-children-prop": "error",
    "react/display-name": "error",
    "no-undef": "error",
    "indent": ["error", 2],
    "quotes": ["error", "single", { "avoidEscape": true }]
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};