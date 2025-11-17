module.exports = {
  displayName: 'jest',
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/'],
  testMatch: ['**/__tests__/**/*.test.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  
  // Module paths
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/EXPORT_REACT_DASHBOARDS/components/$1',
    '^@/hooks/(.*)$': '<rootDir>/EXPORT_REACT_DASHBOARDS/hooks/$1',
    '^@/services/(.*)$': '<rootDir>/EXPORT_REACT_DASHBOARDS/services/$1',
    '^@/types/(.*)$': '<rootDir>/EXPORT_REACT_DASHBOARDS/types/$1',
    '^@/styles/(.*)$': '<rootDir>/EXPORT_REACT_DASHBOARDS/styles/$1',
    '^@/utils/(.*)$': '<rootDir>/utils/$1',
    '^@/constants/(.*)$': '<rootDir>/constants/$1',
    
    // CSS Module mocking
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],

  // Coverage configuration
  collectCoverageFrom: [
    'EXPORT_REACT_DASHBOARDS/**/*.{ts,tsx}',
    '!EXPORT_REACT_DASHBOARDS/**/*.d.ts',
    '!EXPORT_REACT_DASHBOARDS/**/index.ts',
    '!EXPORT_REACT_DASHBOARDS/**/*.stories.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },

  // Transform files
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
    }],
  },

  // Test timeout
  testTimeout: 10000,

  // Ignore patterns
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  
  // Coverage ignore
  coveragePathIgnorePatterns: ['/node_modules/', '/.next/'],

  // Globals
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },

  // Reporter
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './test-results',
        outputName: 'junit.xml',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
        ancestorSeparator: ' › ',
        usePathAsClassName: true,
      },
    ],
  ],
};
