import { ASTNode } from "./ASTNode";
import Token from "../Token";

/**
 * Represents an object literal in the AST.
 */
export interface ObjectLiteral extends ASTNode {
  /**
   * The type of the AST node, always "object".
   */
  type: "object";

  /**
   * The properties of the object.
   */
  properties: ObjectProperty[];
}

/**
 * Represents a property of an object literal in the AST.
 */
export interface ObjectProperty {
  /**
   * The token representing the key of the property.
   */
  key: Token;

  /**
   * The token representing the value type of the property.
   */
  valueType: Token;
}