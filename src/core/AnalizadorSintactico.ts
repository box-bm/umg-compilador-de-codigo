import { ASTNode } from "../types/AST";
import Token from "../types/Token";


class Parser {
  private tokens: Token[][];
  private currentLine: Token[];
  private currentTokenIndex: number;

  constructor(tokens: Token[][]) {
    this.tokens = tokens;
    this.currentLine = [];
    this.currentTokenIndex = 0;
  }

  /**
   * Parses all lines of tokens into an AST.
   */
  public parse(): ASTNode[] {
    const ast: ASTNode[] = [];
    for (const line of this.tokens) {
      this.currentLine = line;
      this.currentTokenIndex = 0;
      const node = this.parseStatement();
      if (node) ast.push(node);
    }
    return ast;
  }

  /**
   * Parses a statement (e.g., variable declaration, expression).
   */
  private parseStatement(): ASTNode| null {
    if (this.isEOF()) return null;

    const token = this.peek();
    if (token.type === "keyword") {
      if (token.value === "let") {
        return this.parseVariableDeclaration();
      } else if (token.value === "if") {
        return this.parseIfStatement();
      }
      // Add more keyword cases (while, for, etc.)
    }

    // If not a keyword, treat as an expression
    return this.parseExpression();
  }

  /**
   * Parses a variable declaration (e.g., `let x = 10;`).
   */
  private parseVariableDeclaration(): ASTNode {
    this.expect("keyword", "let");
    const identifier = this.expect("identifier");
    this.expect("operator", "=");
    const value = this.parseExpression();
    this.consumeSemicolon();
    return {
      type: "VariableDeclaration",
      identifier: identifier.value,
      value,
    };
  }

  /**
   * Parses an if statement (e.g., `if (x > 5) { ... }`).
   */
  private parseIfStatement(): ASTNode {
    this.expect("keyword", "if");
    this.expect("punctuation", "(");
    const condition = this.parseExpression();
    this.expect("punctuation", ")");
    const body = this.parseBlock();
    return {
      type: "IfStatement",
      condition,
      body,
    };
  }

  /**
   * Parses a block of statements (e.g., `{ let x = 5; }`).
   */
  private parseBlock(): ASTNode[] {
    this.expect("punctuation", "{");
    const body: ASTNode[] = [];
    while (!this.isEOF() && this.peek().value !== "}") {
      const stmt = this.parseStatement();
      if (stmt) body.push(stmt);
    }
    this.expect("punctuation", "}");
    return body;
  }

  /**
   * Parses an expression (e.g., `10 + 5`, `"hello"`, `true`).
   */
  private parseExpression():ASTNode {
    return this.parseBinaryExpression();
  }

  /**
   * Parses binary operations (e.g., `x + 5`, `10 * 3`).
   */
  private parseBinaryExpression(precedence = 0):ASTNode {
    let left = this.parsePrimaryExpression();

    while (true) {
      const token = this.peek();
      if (token.type !== "operator") break;

      const opPrecedence = this.getOperatorPrecedence(token.value);
      if (opPrecedence < precedence) break;

      this.consume(); // Eat the operator
      const right = this.parseBinaryExpression(opPrecedence + 1);
      left = {
        type: "BinaryExpression",
        left,
        operator: token.value,
        right,
      };
    }

    return left;
  }

  /**
   * Parses primary expressions (literals, identifiers, parentheses).
   */
  private parsePrimaryExpression(): ASTNode {
    const token = this.consume();

    switch (token.type) {
      case "number":
        return { type: "NumericLiteral", value: Number(token.value) };
      case "string":
        return { type: "StringLiteral", value: token.value };
      case "boolean":
        return { type: "BooleanLiteral", value: token.value === "true" };
      case "identifier":
        return { type: "Identifier", name: token.value };
      case "punctuation":
        if (token.value === "(") {
          const expr = this.parseExpression();
          this.expect("punctuation", ")");
          return expr;
        }
        throw new Error(`Unexpected punctuation: ${token.value}`);
      default:
        throw new Error(`Unexpected token type: ${token.type}`);
    }
  }

  /**
   * Gets operator precedence (higher = tighter binding).
   */
  private getOperatorPrecedence(op: string): number {
    const precedences: Record<string, number> = {
      "*": 3, "/": 3, // High precedence
      "+": 2, "-": 2, // Medium precedence
      "==": 1, "!=": 1, // Low precedence
    };
    return precedences[op] || 0;
  }

  /**
   * Consumes a semicolon if present.
   */
  private consumeSemicolon() {
    if (this.peek().type === "semicolon") {
      this.consume();
    }
  }

  /**
   * Expects a token of a specific type and value.
   */
  private expect(type: TokenType, value?: string): Token {
    const token = this.peek();
    if (token.type !== type || (value !== undefined && token.value !== value)) {
      throw new Error(`Expected ${type}${value ? ` "${value}"` : ""}, got ${token.type} "${token.value}"`);
    }
    return this.consume();
  }

  /**
   * Returns the current token without consuming it.
   */
  private peek(): Token {
    if (this.isEOF()) {
      throw new Error("Unexpected end of line");
    }
    return this.currentLine[this.currentTokenIndex];
  }

  /**
   * Consumes the current token and moves to the next.
   */
  private consume(): Token {
    if (this.isEOF()) {
      throw new Error("Unexpected end of line");
    }
    return this.currentLine[this.currentTokenIndex++];
  }

  /**
   * Checks if we've reached the end of the current line.
   */
  private isEOF(): boolean {
    return this.currentTokenIndex >= this.currentLine.length;
  }
}

const AnalizadorSintactico = (tokens: Token[][]) => {
  try {
    const parser = new Parser(tokens);
    const ast = parser.parse();
    console.log(JSON.stringify(ast, null, 2));
    return ast

} catch (error) {
    console.log(error)
  }
    
  }

export default AnalizadorSintactico;