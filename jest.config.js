const pathsToModuleNameMapper = require("ts-jest").pathsToModuleNameMapper;

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: pathsToModuleNameMapper(
    {
      "@/*": ["./*"],
      "@user/*": ["modules/user/*"],
      "@privateLink/*": ["modules/privateLink/*"],
      "@blogLink/*": ["modules/blogLink/*"],
    },
    {
      prefix: "<rootDir>/src/",
    }
  ),
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  testTimeout: 20000,
};
