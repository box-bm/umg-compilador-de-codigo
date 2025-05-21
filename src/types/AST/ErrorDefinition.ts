/**
 * Represents an error encountered during the processing of an Abstract Syntax Tree (AST).
 */
export interface ErrorDefinition {
  /**
   * A descriptive message providing details about the error.
   */
  message: string;

  /**
   * The column number in the source code where the error occurred.
   */
  column: number;

  /**
   * The line number in the source code where the error occurred.
   */
  line: number;

  /**
   * The type of the error, which can be one of the following:
   * - `SyntaxError`: Indicates a syntax-related issue in the code.
   * - `SemanticError`: Indicates a semantic issue, such as type mismatches or undefined variables.
   * - `RuntimeError`: Indicates an error that occurred during the execution of the code.
   */
  type: 'SyntaxError' | 'SemanticError' | 'RuntimeError';
};