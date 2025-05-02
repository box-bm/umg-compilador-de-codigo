import { ASTNode } from "./ASTNode";
import Token from "../Token";

/**
 * Represents a comparison expression in the AST.
 */
export interface ComparisonExpression extends ASTNode {
  /**
   * The type of the AST node, always "comparison_expression".
   */
  type: "comparison_expression";

  /**
   * The operator used in the comparison expression.
   */
  operator: string;

  /**
   * The left operand of the comparison expression.
   */
  left: Token;

  /**
   * The right operand of the comparison expression.
   */
  right: Token;
}