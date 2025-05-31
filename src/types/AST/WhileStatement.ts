import type { Token } from "../Token";
import type { ASTNode } from "./ASTNode";
import type { BodyStatement } from "./BodyStatement";
import type { ComparisonExpression } from "./ComparisonExpression";
import type { LogicalOperation } from "./LogicalExpression";

export interface WhileStatement extends ASTNode {
  /**
   * The type of the AST node, always "while_statement".
   */
  type: "while_statement";

  /**
   * The condition of the while statement, which can be a comparison expression or a logical operation.
   */
  condition: ComparisonExpression | LogicalOperation | Token;

  /**
   * The body of the while statement, represented as an array of AST nodes.
   */
  body: BodyStatement;
}
