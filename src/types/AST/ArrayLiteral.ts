import { ASTNode } from "./ASTNode";
import Token from "../Token";

/**
 * Represents an array literal in the AST.
 */
export interface ArrayLiteral extends ASTNode {
  /**
   * The type of the AST node, always "array".
   */
  type: "array";

  /**
   * The elements of the array, represented as tokens.
   */
  elements: Token[];
}
