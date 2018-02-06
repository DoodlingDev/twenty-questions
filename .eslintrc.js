module.exports = {
  "extends": [
    "plugin:react-pug/all",
    "google",
  ],
  "parser": "babel-eslint",
  "env": {
    "browser": true,
    "node": true,
    "es6": true,
  },
  "plugins": [
    "react-pug",
    "prettier",
    "flowtype-errors",
  ],
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true,
      "impliedStrict": true,
    },
  },
  "rules": {
    "no-multi-spaces": "off",
    "quotes": ["error", "double"],
    "arrow-parens": ["error", "as-needed"],
    "one-var": "off",
  },
};
