enum TokenType {
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Identifier = 'identifier',
  Keyword = 'keyword',
  Operator = 'operator',
  Punctuation = 'punctuation',
  Comment = 'comment',
  Whitespace = 'whitespace',
  Unknown = 'unknown',
  BlockComment = 'block-comment',
  LineComment = 'line-comment',
  EndOfLine = 'end-of-line',
}

export default TokenType;