module.exports = {
    parser: '@babel/eslint-parser',
    extends: [
      "eslint:recommended",
      "plugin:react/recommended",
    ],
    plugins: ["react"],
    env: {
      browser: true,
      es6: true,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // Customize your rules here
    },
  };
  