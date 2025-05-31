/**
 * Represents the various types of tokens that can be identified
 * during the lexical analysis phase of a compiler or interpreter.
 *
 * This type is used to categorize tokens into different groups
 * based on their roles in the source code.
 *
 * The types include:
 * - `keyword`: Reserved words in the programming language (e.g., `if`, `else`, `while`).
 * - `identifier`: Names given to variables, functions, classes, etc.
 * - `punctuation`: Symbols that separate or organize code (e.g., `,`, `.`, `;`).
 * - `operator`: Symbols that perform operations on variables and values (e.g., `+`, `-`, `*`, `/`).
 * - `number`: Numeric literals (e.g., `42`, `3.14`).
 * - `semicolon`: The semicolon symbol (`;`), often used to terminate statements.
 * - `string`: String literals enclosed in quotes (e.g., `"Hello, World!"`).
 * - `unknown`: Tokens that do not fit into any of the above categories.
 * - `boolean`: Boolean literals (`true`, `false`).
 */
type TokenType =
  | "keyword"
  | "identifier"
  | "punctuation"
  | "operator"
  | "number"
  | "semicolon"
  | "string"
  | "unknown"
  | "boolean";

export type { TokenType };
