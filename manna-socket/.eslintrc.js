module.exports = {
  env: {
    "node": true,
    "es6": true
  },
  parser: "@typescript-eslint/parser",
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "no-unused-vars": 0,
    "@typescript-eslint/no-unused-vars": "error",
    "indent": ["error", 2],
    "quotes": [1, "single", { "avoidEscape": true }],
    "semi": [
      "error",
      "always"
    ],
    "object-curly-spacing": ["error", "always"],
    
  },
};
