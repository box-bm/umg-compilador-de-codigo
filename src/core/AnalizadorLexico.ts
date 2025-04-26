import Token from "../types/Token";
import TokenPatternTable from "../tables/TokenPatternTable";
import TokenType from "../types/TokenType"; // Ensure this type exists and matches TokenPatternTable

const AnalizadorLexico = (line: string): Token[] => {
  const tokens: Token[] = [];
  let currentIndex = 0;

  const lineTokens = line.match(/"[^"]*"|\d+|[a-zA-Z_]\w*|;|\S+/g) || [];
  for (const token of lineTokens) {
    let matched = false;

    for (const [pattern, { regex }] of Object.entries(TokenPatternTable)) {
      const match = new RegExp(regex);

      if (match.test(token) && pattern !== TokenType.Unknown) {
        if (pattern === TokenType.EndOfLine) {
          currentIndex -= 1; // Adjust for the end of line token
        }
        tokens.push({
          type: pattern as TokenType,
          value: token,
          column: currentIndex,
        });
        matched = true;
        break;
      }
    }

    if (!matched) {
      throw new Error(`Unknown token at index ${currentIndex}`);
    }

    currentIndex += token.length + 1; // +1 for the space or separator
  }
  return tokens;
};

export default AnalizadorLexico;
