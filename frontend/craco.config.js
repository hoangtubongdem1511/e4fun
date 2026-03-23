const path = require("path");

module.exports = {
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  jest: {
    configure: (jestConfig) => {
      jestConfig.setupFiles = [
        ...(jestConfig.setupFiles || []),
        path.join(__dirname, "jest.polyfills.js"),
      ];
      return jestConfig;
    },
  },
};
