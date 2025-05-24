/**
 * Represents a generic Abstract Syntax Tree (AST) node.
 */
export interface ASTNode {
  /**
   * The type of the AST node.
   */
  type: string;
  [key: string]: any;
}

export default ASTNode






