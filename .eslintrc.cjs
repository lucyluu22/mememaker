

module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json'
  },
  plugins: ['react-refresh'],
  rules: {
    'import/no-absolute-path': 'off',
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/semi': ['error', 'never'],
    'react-refresh/only-export-components': 'warn',
  },
}
