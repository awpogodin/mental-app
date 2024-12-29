// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ["expo", "prettier"],
  plugins: ['prettier'],
  rules: {
    "sort-imports": [
      "error",
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
      },
    ],
    "import/no-restricted-paths": [
      "error",
      {
        zones: [
          // disables cross-feature imports:
          // eg. src/features/discussions should not import from src/features/comments, etc.
          {
            target: "./src/features/user",
            from: "./src/features",
            except: ["./user"],
          },
          {
            target: "./src/features/auth",
            from: "./src/features",
            except: ["./auth"],
          },
          // More restrictions...

          // enforce unidirectional codebase:
          // e.g. src/app can import from src/features but not the other way around
          {
            target: "./src/features",
            from: "./src/app",
          },

          // e.g src/features and src/app can import from these shared modules but not the other way around
          {
            target: [
              "./src/components",
              "./src/hooks",
              "./src/lib",
              "./src/types",
              "./src/utils",
            ],
            from: ["./src/features", "./src/app"],
          },
        ],
      },
    ],
  },
};
