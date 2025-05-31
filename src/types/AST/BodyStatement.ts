import type { BinaryExpression } from "./BinaryExpression";
import type { ComparisonExpression } from "./ComparisonExpression";
import type { ForStatement } from "./ForStatement";
import type { IfStatement } from "./IfStatement";
import type { LogicalOperation } from "./LogicalExpression";
import type { PrintStatement } from "./PrintStatement";

import type {
  Assignment,
  ConstantVariableDeclaration,
  VariableDeclaration,
} from "./VariableDefinition";
import type { WhileStatement } from "./WhileStatement";

/**
 * Represents the body of a statement in the Abstract Syntax Tree (AST).
 *
 * The `Body` type is a union of various possible statement or expression types
 * that can appear within the body of a program.
 *
 * This type is used to define the structure of statements or expressions
 * that can be part of the body of a program in the AST.
 */
type Body =
  | BinaryExpression
  | ComparisonExpression
  | IfStatement
  | LogicalOperation
  | VariableDeclaration
  | Assignment
  | ConstantVariableDeclaration
  | PrintStatement
  | ForStatement
  | WhileStatement;

export type BodyStatement = Body[];
