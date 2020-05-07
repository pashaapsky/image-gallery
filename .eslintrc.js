module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    "plugin:react-redux/recommended"
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
    "react-redux"
  ],

  rules: {
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    "react-redux/connect-prefer-named-arguments": 2,
    "react/prop-types" : 0,
    "react/require-render-return" : 0,
    "no-useless-constructor": "off",
    "react/destructuring-assignment" : 0,
    "react-redux/mapStateToProps-no-store" : 0,
    "no-restricted-globals": 0,
    "brace-style": [2, "stroustrup", { "allowSingleLine": true }],
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }]
  },

};
