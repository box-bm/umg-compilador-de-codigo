import { ArrayLiteral } from "./ArrayLiteral";
import { ASTNode } from "./ASTNode";
import { BinaryExpression } from "./BinaryExpression";
import { ObjectLiteral } from "./ObjectLiteral";
import Token from "../Token";

/**
 * Represents a variable declaration in the AST.
 */
export interface VariableDeclaration extends ASTNode {
  /**
   * The type of the AST node, always "new_variable_declaration".
   */
  type: "new_variable_declaration";

  /**
   * The token representing the variable being declared.
   */
  variable: Token;
}

/**
 * Represents a constant variable declaration in the AST.
 */
export interface ConstantVariableDeclaration extends ASTNode {
  /**
   * The type of the AST node, always "constant_variable_declaration".
   */
  type: "constant_variable_declaration";

  /**
   * The token representing the constant variable being declared.
   */
  variable: Token;

  /**
   * The token representing the value assigned to the constant variable.
   */
  value: Token;
}

/**
 * Represents an assignment operation in the AST.
 */
export interface Assignment extends ASTNode {
  /**
   * The type of the AST node, always "assignment".
   */
  type:
    | "assignment"
    | "new_variable_declaration_assignment"
    | "constant_variable_declaration_assignment";

  /**
   * The token representing the variable being assigned a value.
   */
  variable: Token;

  /**
   * The value being assigned, which can be a token, an array literal, an object literal, or a binary expression.
   */
  value: Token | ArrayLiteral | ObjectLiteral | BinaryExpression;
}