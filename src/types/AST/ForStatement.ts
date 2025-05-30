import Token from "../Token";
import { ASTNode } from "./ASTNode";
import { BodyStatement } from "./BodyStatement";
import { VariableDeclaration } from "./VariableDefinition";

export interface ForStatement extends ASTNode {
  /**
   * The type of the AST node, always "for_statement".
   * */
  type: "for_statement";

  /**
   * The loop variable identifier.
   */
  iterator: VariableDeclaration;

  /**
   * The initial value expression.
   */
  init: Token;

  /**
   * The final value expression.
   */
  end: Token;

  /**
   * The step value expression (optional).
   */
  step?: Token;

  /**
   * The body of the for loop, which is an array of AST nodes.
   */
  body: BodyStatement;
}
