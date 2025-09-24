module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat','fix','docs','chore','build','ci','test','refactor','perf','style']],
    'scope-case': [2, 'always', 'kebab-case'],
    'subject-max-length': [2, 'always', 72]
  }
};
