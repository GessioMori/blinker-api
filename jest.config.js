const pathsToModuleNameMapper = require("ts-jest").pathsToModuleNameMapper;

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: pathsToModuleNameMapper(
    {
      "@/*": ["./*"],
      "@user/*": ["modules/user/*"],
    },
    {
      prefix: "<rootDir>/src/",
    }
  ),
};
