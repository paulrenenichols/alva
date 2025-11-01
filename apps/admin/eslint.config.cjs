const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const { fixupConfigRules } = require('@eslint/compat');
const baseConfig = require('../../.eslintrc.json');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  ...fixupConfigRules(compat.extends('next')),
  ...fixupConfigRules(compat.extends('next/core-web-vitals')),
  ...fixupConfigRules(compat.config(baseConfig)),
  {
    ignores: ['.next/**/*'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
];
