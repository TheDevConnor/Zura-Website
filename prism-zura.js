// prism-zura.js — Custom Prism syntax highlighter for Zura

Prism.languages.zura = {
  'comment': /#.*/,

  'string': {
    pattern: /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/,
    greedy: true
  },

  'number': /\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/,

  'keyword': /\b(?:const|fn|have|auto|loop|if|else|return|enum|struct|typename|template)\b/,

  'type': /\b(?:int|float|bool|str|char)\b/,

  'builtin': /@\w+/,

  'function': {
    pattern: /\bfn\s+\w+(?=\s*\()/,
    alias: 'function'
  },

  'operator': /[:=(){}\[\],;.+\-*/<>]/,

  'variable': {
    pattern: /\b\w+\b/,
    alias: 'variable'
  }
};
