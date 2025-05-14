/**
 * Represents the various types of tokens that can be identified
 * during the lexical analysis phase of a compiler or interpreter.
 *
 * @typedef TokenType
 * @type {"keyword" | "identifier" | "colon" | "type" | "operator" | "number" | "semicolon" | "brace" | "string" | "comma" | "bracket" | "unknown" | "boolean"}
 *
 * @property "keyword"    Represents a reserved word in the language.
 * @property "identifier" Represents a variable, function, or other user-defined name.
 * @property "colon"      Represents a colon (`:`) symbol.
 * @property "type"       Represents a type annotation or declaration.
 * @property "operator"   Represents an operator (e.g., `+`, `-`, `*`, `/`).
 * @property "number"     Represents a numeric literal.
 * @property "semicolon"  Represents a semicolon (`;`) symbol.
 * @property "brace"      Represents a brace (`{` or `}`) symbol.
 * @property "string"     Represents a string literal.
 * @property "comma"      Represents a comma (`,`) symbol.
 * @property "bracket"    Represents a bracket (`[` or `]`) symbol.
 * @property "unknown"    Represents an unrecognized or invalid token.
 * @property "boolean"    Represents a boolean literal (`true` or `false`).
 */
type TokenType =
  | "keyword"
  | "identifier"
  | "colon"
  | "type"
  | "operator"
  | "number"
  | "semicolon"
  | "brace"
  | "string"
  | "comma"
  | "bracket"
  | "unknown"
  | "boolean"
  ;

export default TokenType;
