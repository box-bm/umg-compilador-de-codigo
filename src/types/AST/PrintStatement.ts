import type { Token } from "../Token";
import type { ASTNode } from "./ASTNode";
import type { BinaryExpression } from "./BinaryExpression";
import type { ComparisonExpression } from "./ComparisonExpression";
import type { LogicalOperation } from "./LogicalExpression";

type Expression =
  | Token
  | ComparisonExpression
  | BinaryExpression
  | LogicalOperation;

export interface PrintStatement extends ASTNode {
  type: "print_statement";
  argument: Expression;
}
