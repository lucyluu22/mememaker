module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
  },
  plugins: ['react-refresh'],
  rules: {
    'import/prefer-default-export': 'off',
    'import/no-absolute-path': 'off',
    'arrow-parens': ['error', 'as-needed'],
    '@typescript-eslint/semi': ['error', 'never'],
    'react/react-in-jsx-scope': 'off',
    'react-refresh/only-export-components': 'warn',
  },
}
