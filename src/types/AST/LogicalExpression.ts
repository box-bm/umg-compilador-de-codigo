import { ASTNode } from "./ASTNode";
import { BinaryExpression } from "./BinaryExpression";
import Token from "../Token";

/**
 * Represents a logical operation in the AST.
 */
export interface LogicalOperation extends ASTNode {
  /**
   * The type of the AST node, always "logical_operation".
   */
  type: "logical_operation";

  /**
   * The operator used in the logical operation.
   */
  operator: "&&" | "||" | "!";

  /**
   * The left operand of the logical operation, which can be null.
   */
  left: Token | null;

  /**
   * The right operand of the logical operation, which can be a token or a binary expression.
   */
  right?: Token | BinaryExpression;
}
