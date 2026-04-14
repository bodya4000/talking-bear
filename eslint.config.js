import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
        
    rules: {
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
        { blankLine: 'always', prev: '*', next: 'block-like' },
        { blankLine: 'always', prev: 'block-like', next: '*' },
        { blankLine: 'always', prev: 'if', next: '*' },
        { blankLine: 'always', prev: '*', next: 'return' }
      ],
    }
  },
  {
    ignores: ["node_modules/", "ios", "android"]
  }
);