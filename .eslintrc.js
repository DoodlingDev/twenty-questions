module.exports = {
  "extends": [
    "eslint-config-google",
    "plugin:react/recommended",
    "prettier",
    "prettier/react",
  ],
  "parser": "babel-eslint",
  "env": {
    "browser": true,
    "node": true,
    "es6": true,
  },
  "plugins": [
    "react",
    "promise",
    "prettier",
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
    "react/jsx-uses-vars": 1,
    "ignoreStrings": "off",
    "ignoreComments": "off",
    "no-multi-spaces": "off",
    "quotes": ["error", "double"],
    "arrow-parens": ["error", "as-needed"],
    "object-curly-spacing": ["error", "always", {"objectsInObjects": false}],
    "one-var": "off",
  },
};
