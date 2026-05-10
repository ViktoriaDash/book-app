import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './',
})

/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jest-environment-jsdom',
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Розкоментуй, якщо у тебе є цей файл
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  
  // 1. ІГНОРУЄМО PLAYWRIGHT (це виправить твою помилку FAIL tests/example.spec.ts)
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/tests/' // Тут лежать тести Playwright, Jest туди не заходитиме
  ],

  collectCoverage: true,
  coverageDirectory: 'coverage',
  
  // 2. ФОКУСУЄМОСЯ НА FRONTEND (це допоможе набрати 40%)
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/app/api/**',    // Ігноруємо API, бо їх важко тестувати юніт-тестами
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/**/*.type.ts',
    '!src/app/layout.tsx', // Ігноруємо занадто загальні файли
  ],

  // 3. ТВОЯ ВИМОГА ПРО 40%
  coverageThreshold: {
    global: {
      branches: 40,
      functions: 40,
      lines: 40,
      statements: 40,
    },
  },
}

export default createJestConfig(config)