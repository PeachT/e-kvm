module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true
  },
  extends: 'airbnb-base',
  globals: {
    __static: true
  },
  plugins: [
    'html'
  ],
  'rules': {
    'global-require': 0,
    'import/no-unresolved': 0,
    'no-param-reassign': 0,
    'no-shadow': 0,
    'import/extensions': 0,
    'import/newline-after-import': 0,
    'no-multi-assign': 0,
    // 禁止出现未使用过的变量
    "no-unused-vars": [1, { "vars": "all", "args": "none" }],
    // 允许使用devDependencies中的包
    "import/no-extraneous-dependencies": ["error", {"devDependencies": true}],
    "import/no-dynamic-require": ["error"],
    "no-empty": 1,
    "arrow-body-style": 0,
    "object-shorthand": [0, "always", { "avoidExplicitReturnArrows": true }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
