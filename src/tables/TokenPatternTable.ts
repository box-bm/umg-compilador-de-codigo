import TokenPatterns from "../types/TokenPatterns";

const TokenPatternTable: TokenPatterns = {
  string: {
    regex: /"(?:\\.|[^"\\])*"/,
    description: "String literal",
    example: '"Hello, world!"',
  },
  number: {
    regex: /\b\d+(\.\d+)?\b/,
    description: "Number literal",
    example: "42",
  },
  boolean: {
    regex: /\b(true|false)\b/,
    description: "Boolean literal",
    example: "true",
  },
  keyword: {
    regex: /\b(if|else|for|while|return|int|string)\b/,
    description: "Keyword",
    example: "if",
  },
  "end-of-line": {
    regex: /^;\s*$/,
    description: "End of line",
    example: ";",
  },
  identifier: {
    regex: /\b[a-zA-Z_][a-zA-Z0-9_]*\b/,
    description: "Identifier",
    example: "variableName",
  },
  operator: {
    regex: /[+\-*/=<>!&|]/,
    description: "Operator",
    example: "+",
  },
  whitespace: {
    regex: /\s+/,
    description: "Whitespace",
    example: " ",
  },
  comment: {
    regex: /\/\/.*|\/\*[\s\S]*?\*\//,
    description: "Comment",
    example: "// This is a comment",
  },
  punctuation: {
    regex: /[.,:(){}[\]]/,
    description: "Punctuation",
    example: ",",
  },
  "block-comment": {
    regex: /\/\*[\s\S]*?\*\//,
    description: "Block comment",
    example: "/* This is a block comment */",
  },
  "line-comment": {
    regex: /\/\/.*$/,
    description: "Line comment",
    example: "// This is a line comment",
  },
  unknown: {
    regex: /./,
    description: "Unknown token",
    example: "?",
  },
};

export default TokenPatternTable;
