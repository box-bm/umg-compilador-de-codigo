import { ArrayLiteral } from "./ArrayLiteral";
import { BinaryExpression } from "./BinaryExpression";
import { ComparisonExpression } from "./ComparisonExpression";
import {
  FunctionCall,
  FunctionDeclaration,
  ReturnStatement,
} from "./FunctionDefinition";
import { IfStatement } from "./IfStatement";
import { LogicalOperation } from "./LogicalExpression";
import { ObjectLiteral } from "./ObjectLiteral";
import {
  Assignment,
  ConstantVariableDeclaration,
  VariableDeclaration,
} from "./VariableDefinition";

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
  | ArrayLiteral
  | BinaryExpression
  | ComparisonExpression
  | FunctionDeclaration
  | FunctionCall
  | IfStatement
  | LogicalOperation
  | ObjectLiteral
  | VariableDeclaration
  | Assignment
  | ConstantVariableDeclaration
  | ReturnStatement;

export type BodyStatement = Body[];
