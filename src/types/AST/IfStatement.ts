import Token from "../Token";
import { ASTNode } from "./ASTNode";
import { BodyStatement } from "./BodyStatement";
import { ComparisonExpression } from "./ComparisonExpression";
import { LogicalOperation } from "./LogicalExpression";

/**
 * Represents an if statement in the AST.
 */
export interface IfStatement extends ASTNode {
  /**
   * The type of the AST node, always "if_statement".
   */
  type: "if_statement";

  /**
   * The condition of the if statement, which can be a comparison expression or a logical operation.
   */
  condition: ComparisonExpression | LogicalOperation | Token;

  /**
   * The body of the if statement, represented as an array of AST nodes.
   */
  body: BodyStatement;

  /**
   * The body of the else clause, if present, represented as an array of AST nodes.
   */
  elseBody?: BodyStatement;

  /**
   * The else-if clause, if present, represented as another if statement.
   */
  elseIf?: IfStatement;
}
