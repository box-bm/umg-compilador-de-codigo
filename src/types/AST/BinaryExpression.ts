import type { ASTNode } from "./ASTNode";
import type { Token } from "../Token";
import type { ComparisonExpression } from "./ComparisonExpression";

type Side = Token | BinaryExpression | ComparisonExpression;

/**
 * Represents a binary expression in the AST.
 */
export interface BinaryExpression extends ASTNode {
  /**
   * The type of the AST node, always "binary_expression".
   */
  type: "binary_expression";

  /**
   * The operator used in the binary expression.
   */
  operator: string;

  /**
   * The left operand of the binary expression, which can be a token or another binary expression.
   */
  left: Side;

  /**
   * The right operand of the binary expression, which can be a token or another binary expression.
   */
  right: Side;
}
