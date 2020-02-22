module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    "^@modules(.*)$": "<rootDir>/src/modules$1",
    "^@services(.*)$": "<rootDir>/src/services$1",
    "^@libs(.*)$": "<rootDir>/src/libs$1",
  }
}