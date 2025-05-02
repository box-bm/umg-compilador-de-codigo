import TokenType from "./TokenType";

interface Token {
  type: TokenType;
  value: string;
  column: number;
}

export default Token;