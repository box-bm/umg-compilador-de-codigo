import TokenType from "./TokenType";

/**
 * Represents a token in the source code, typically used in lexical analysis.
 * A token is a fundamental unit of the code, such as a keyword, identifier, or symbol.
 */
interface Token {
  /**
   * The type of the token, indicating its category (e.g., keyword, identifier, etc.).
   */
  type: TokenType;

  /**
   * The actual value or text of the token as it appears in the source code.
   */
  value: string;

  /**
   * The column number in the source code where the token starts.
   */
  column: number;
}

export default Token;



