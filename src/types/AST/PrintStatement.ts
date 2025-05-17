import Token from "../Token";
import { ASTNode } from "./ASTNode";
import { BinaryExpression } from "./BinaryExpression";
import { ComparisonExpression } from "./ComparisonExpression";
import { LogicalOperation } from "./LogicalExpression";

type Expression =
  | Token
  | ComparisonExpression
  | BinaryExpression
  | LogicalOperation;

export interface PrintStatement extends ASTNode {
  type: "print_statement";
  argument: Expression;
}
