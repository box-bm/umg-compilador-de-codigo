import { ASTNode } from "./ASTNode";
import { BinaryExpression } from "./BinaryExpression";
import Token from "../Token";

/**
 * Represents a function declaration in the AST.
 */
export interface FunctionDeclaration extends ASTNode {
  /**
   * The type of the AST node, always "function_declaration".
   */
  type: "function_declaration";

  /**
   * The token representing the name of the function.
   */
  name: Token;

  /**
   * The parameters of the function, represented as an array of tokens.
   */
  parameters: Token[];

  /**
   * The body of the function, represented as an array of AST nodes.
   */
  body: ASTNode[];
}

/**
 * Represents a function call in the AST.
 */
export interface FunctionCall extends ASTNode {
  /**
   * The type of the AST node, always "function_call".
   */
  type: "function_call";

  /**
   * The token representing the name of the function being called.
   */
  name: Token;

  /**
   * The arguments passed to the function, which can be tokens or nested function calls.
   */
  arguments: (Token | FunctionCall)[];
}

/**
 * Represents a return statement in the AST.
 */
export interface ReturnStatement extends ASTNode {
  /**
   * The type of the AST node, always "return_statement".
   */
  type: "return_statement";

  /**
   * The value being returned, which can be a binary expression or a token.
   */
  value: BinaryExpression | Token;
}
