import Token from "../types/Token";
import AnalizadorSintactico from "./AnalizadorSintactico";
import type {
  VariableDeclaration,
  ErrorDefinition,
  Assignment,
  BinaryExpression,
  ComparisonExpression,
  ConstantVariableDeclaration,
  FunctionCall,
  FunctionDeclaration,
  IfStatement,
  LogicalOperation,
} from "../types/AST";

describe("AnalizadorSintactico", () => {
  describe("Asigments", () => {
    describe("New Variable Asigments", () => {
      it("should declare a variable without initialization", () => {
        const tokens: Token[] = [
          { type: "keyword", value: "let", column: 1 },
          { type: "identifier", value: "x", column: 5 },
          { type: "semicolon", value: ";", column: 6 },
        ];
        const resultado = AnalizadorSintactico(tokens);
        expect(resultado).toEqual<VariableDeclaration>({
          type: "new_variable_declaration",
          variable: { type: "identifier", value: "x", column: 5 },
        });
      });

      it("should declare a constant variable without initialization", () => {
        const tokens: Token[] = [
          { type: "keyword", value: "const", column: 1 },
          { type: "identifier", value: "x", column: 7 },
          { type: "semicolon", value: ";", column: 8 },
        ];
        const resultado = AnalizadorSintactico(tokens);
        expect(resultado).toEqual<ErrorDefinition>({
          type: "SyntaxError",
          message: "Expected an assignment after 'const' declaration",
          column: 8,
        });
      });

      it("should declare a constant variable", () => {
        const tokens: Token[] = [
          { type: "keyword", value: "const", column: 1 },
          { type: "identifier", value: "x", column: 7 },
          { type: "operator", value: "=", column: 9 },
          { type: "number", value: "5", column: 11 },
          { type: "semicolon", value: ";", column: 12 },
        ];
        const resultado = AnalizadorSintactico(tokens);
        expect(resultado).toEqual<ConstantVariableDeclaration>({
          type: "constant_variable_declaration",
          variable: { type: "identifier", value: "x", column: 7 },
          value: { type: "number", value: "5", column: 11 },
        });
      });

      it("shoud parse string assignment", () => {
        const tokens: Token[] = [
          { type: "keyword", value: "let", column: 1 },
          { type: "identifier", value: "x", column: 5 },
          { type: "operator", value: "=", column: 7 },
          { type: "string", value: '"Hello"', column: 9 },
          { type: "semicolon", value: ";", column: 16 },
        ];

        const resultado = AnalizadorSintactico(tokens);

        expect(resultado).toEqual<Assignment>({
          type: "new_variable_declaration_assignment",
          variable: { type: "identifier", value: "x", column: 5 },
          value: { type: "string", value: '"Hello"', column: 9 },
        });
      });

      it("should parse number assignment", () => {
        const tokens: Token[] = [
          { type: "keyword", value: "let", column: 1 },
          { type: "identifier", value: "x", column: 5 },
          { type: "operator", value: "=", column: 7 },
          { type: "number", value: "42", column: 9 },
          { type: "semicolon", value: ";", column: 11 },
        ];

        const resultado = AnalizadorSintactico(tokens);

        expect(resultado).toEqual<Assignment>({
          type: "new_variable_declaration_assignment",
          variable: { type: "identifier", value: "x", column: 5 },
          value: { type: "number", value: "42", column: 9 },
        });
      });

      it("should parse boolean assignment", () => {
        const tokens: Token[] = [
          { type: "keyword", value: "let", column: 1 },
          { type: "identifier", value: "x", column: 5 },
          { type: "operator", value: "=", column: 7 },
          { type: "boolean", value: "true", column: 9 },
          { type: "semicolon", value: ";", column: 13 },
        ];

        const resultado = AnalizadorSintactico(tokens);

        expect(resultado).toEqual<Assignment>({
          type: "new_variable_declaration_assignment",
          variable: { type: "identifier", value: "x", column: 5 },
          value: { type: "boolean", value: "true", column: 9 },
        });
      });
    });

    describe("Variable assignment", () => {
      it("should parse variable assignment", () => {
        const tokens: Token[] = [
          { type: "identifier", value: "x", column: 1 },
          { type: "operator", value: "=", column: 2 },
          { type: "identifier", value: "5", column: 4 },
          { type: "semicolon", value: ";", column: 5 },
        ];
        const resultado = AnalizadorSintactico(tokens);
        expect(resultado).toEqual<Assignment>({
          type: "assignment",
          variable: { type: "identifier", value: "x", column: 5 },
          value: { type: "identifier", value: "5", column: 4 },
        });
      });

      it("should parse variable assignment with string", () => {
        const tokens: Token[] = [
          { type: "identifier", value: "x", column: 1 },
          { type: "operator", value: "=", column: 2 },
          { type: "string", value: '"Hello"', column: 4 },
          { type: "semicolon", value: ";", column: 11 },
        ];

        const resultado = AnalizadorSintactico(tokens);

        expect(resultado).toEqual<Assignment>({
          type: "assignment",
          variable: { type: "identifier", value: "x", column: 1 },
          value: { type: "string", value: '"Hello"', column: 4 },
        });
      });

      it("should parse variable assignment with boolean", () => {
        const tokens: Token[] = [
          { type: "identifier", value: "x", column: 1 },
          { type: "operator", value: "=", column: 2 },
          { type: "boolean", value: "true", column: 4 },
          { type: "semicolon", value: ";", column: 8 },
        ];

        const resultado = AnalizadorSintactico(tokens);
        expect(resultado).toEqual<Assignment>({
          type: "assignment",
          variable: { type: "identifier", value: "x", column: 1 },
          value: { type: "boolean", value: "true", column: 4 },
        });
      });
    });

    describe("Arrays Asigments", () => {
      it("should parse empty array assignment", () => {
        const tokens: Token[] = [
          { type: "keyword", value: "let", column: 1 },
          { type: "identifier", value: "x", column: 5 },
          { type: "operator", value: "=", column: 7 },
          { type: "bracket", value: "[", column: 9 },
          { type: "bracket", value: "]", column: 10 },
          { type: "semicolon", value: ";", column: 11 },
        ];

        const resultado = AnalizadorSintactico(tokens);

        expect(resultado).toEqual<Assignment>({
          type: "new_variable_declaration_assignment",
          variable: { type: "identifier", value: "x", column: 5 },
          value: {
            type: "array",
            elements: [],
          },
        });
      });

      it("should parse array assignment with numbers", () => {
        const tokens: Token[] = [
          { type: "keyword", value: "let", column: 1 },
          { type: "identifier", value: "x", column: 5 },
          { type: "operator", value: "=", column: 7 },
          { type: "bracket", value: "[", column: 9 },
          { type: "number", value: "1", column: 10 },
          { type: "comma", value: ",", column: 11 },
          { type: "number", value: "2", column: 12 },
          { type: "bracket", value: "]", column: 13 },
          { type: "semicolon", value: ";", column: 14 },
        ];

        const resultado = AnalizadorSintactico(tokens);

        expect(resultado).toEqual<Assignment>({
          type: "new_variable_declaration_assignment",
          variable: { type: "identifier", value: "x", column: 5 },
          value: {
            type: "array",
            elements: [
              { type: "number", value: "1", column: 10 },
              { type: "number", value: "2", column: 12 },
            ],
          },
        });
      });

      it("should parse array assignment with strings", () => {
        const tokens: Token[] = [
          { type: "keyword", value: "let", column: 1 },
          { type: "identifier", value: "x", column: 5 },
          { type: "operator", value: "=", column: 7 },
          { type: "bracket", value: "[", column: 9 },
          { type: "string", value: '"Hello"', column: 10 },
          { type: "comma", value: ",", column: 17 },
          { type: "string", value: '"World"', column: 18 },
          { type: "bracket", value: "]", column: 25 },
          { type: "semicolon", value: ";", column: 26 },
        ];

        const resultado = AnalizadorSintactico(tokens);

        expect(resultado).toEqual<Assignment>({
          type: "new_variable_declaration_assignment",
          variable: { type: "identifier", value: "x", column: 5 },
          value: {
            type: "array",
            elements: [
              { type: "string", value: '"Hello"', column: 10 },
              { type: "string", value: '"World"', column: 18 },
            ],
          },
        });
      });

      it("should parse array assignment with booleans", () => {
        const tokens: Token[] = [
          { type: "keyword", value: "let", column: 1 },
          { type: "identifier", value: "x", column: 5 },
          { type: "operator", value: "=", column: 7 },
          { type: "bracket", value: "[", column: 9 },
          { type: "boolean", value: "true", column: 10 },
          { type: "comma", value: ",", column: 14 },
          { type: "boolean", value: "false", column: 15 },
          { type: "bracket", value: "]", column: 20 },
          { type: "semicolon", value: ";", column: 21 },
        ];

        const resultado = AnalizadorSintactico(tokens);

        expect(resultado).toEqual<Assignment>({
          type: "new_variable_declaration_assignment",
          variable: { type: "identifier", value: "x", column: 5 },
          value: {
            type: "array",
            elements: [
              { type: "boolean", value: "true", column: 10 },
              { type: "boolean", value: "false", column: 15 },
            ],
          },
        });
      });

      it("should parse array assignment with mixed types", () => {
        const tokens: Token[] = [
          { type: "keyword", value: "let", column: 1 },
          { type: "identifier", value: "x", column: 5 },
          { type: "operator", value: "=", column: 7 },
          { type: "bracket", value: "[", column: 9 },
          { type: "number", value: "1", column: 10 },
          { type: "comma", value: ",", column: 11 },
          { type: "string", value: '"Hello"', column: 12 },
          { type: "comma", value: ",", column: 19 },
          { type: "boolean", value: "true", column: 20 },
          { type: "bracket", value: "]", column: 24 },
          { type: "semicolon", value: ";", column: 25 },
        ];

        const resultado = AnalizadorSintactico(tokens);

        expect(resultado).toEqual<Assignment>({
          type: "new_variable_declaration_assignment",
          variable: { type: "identifier", value: "x", column: 5 },
          value: {
            type: "array",
            elements: [
              { type: "number", value: "1", column: 10 },
              { type: "string", value: '"Hello"', column: 12 },
              { type: "boolean", value: "true", column: 20 },
            ],
          },
        });
      });

      it("should parse array without new variable declaration", () => {
        const tokens: Token[] = [
          { type: "identifier", value: "x", column: 1 },
          { type: "operator", value: "=", column: 2 },
          { type: "bracket", value: "[", column: 4 },
          { type: "number", value: "1", column: 5 },
          { type: "comma", value: ",", column: 6 },
          { type: "number", value: "2", column: 7 },
          { type: "bracket", value: "]", column: 8 },
          { type: "semicolon", value: ";", column: 9 },
        ];

        const resultado = AnalizadorSintactico(tokens);

        expect(resultado).toEqual<Assignment>({
          type: "assignment",
          variable: { type: "identifier", value: "x", column: 1 },
          value: {
            type: "array",
            elements: [
              { type: "number", value: "1", column: 5 },
              { type: "number", value: "2", column: 7 },
            ],
          },
        });
      });
    });

    describe("Object Asigments", () => {
      it("should parse empty object assignment", () => {
        const tokens: Token[] = [
          { type: "keyword", value: "let", column: 1 },
          { type: "identifier", value: "x", column: 5 },
          { type: "operator", value: "=", column: 7 },
          { type: "brace", value: "{", column: 9 },
          { type: "brace", value: "}", column: 10 },
          { type: "semicolon", value: ";", column: 11 },
        ];
        const resultado = AnalizadorSintactico(tokens);
        expect(resultado).toEqual<Assignment>({
          type: "new_variable_declaration_assignment",
          variable: { type: "identifier", value: "x", column: 5 },
          value: { type: "object", properties: [] },
        });
      });

      it("should parse object assignment with strings and booleans and numbers ", () => {
        const tokens: Token[] = [
          { type: "keyword", value: "let", column: 1 },
          { type: "identifier", value: "x", column: 5 },
          { type: "operator", value: "=", column: 7 },
          { type: "brace", value: "{", column: 9 },
          { type: "identifier", value: "a", column: 10 },
          { type: "operator", value: ":", column: 11 },
          { type: "string", value: '"Hello"', column: 13 },
          { type: "comma", value: ",", column: 20 },
          { type: "identifier", value: "b", column: 21 },
          { type: "operator", value: ":", column: 22 },
          { type: "boolean", value: "true", column: 24 },
          { type: "comma", value: ",", column: 28 },
          { type: "identifier", value: "c", column: 29 },
          { type: "operator", value: ":", column: 30 },
          { type: "number", value: "1", column: 32 },
          { type: "brace", value: "}", column: 33 },
          { type: "semicolon", value: ";", column: 34 },
        ];
        const resultado = AnalizadorSintactico(tokens);
        expect(resultado).toEqual<Assignment>({
          type: "new_variable_declaration_assignment",
          variable: { type: "identifier", value: "x", column: 5 },
          value: {
            type: "object",
            properties: [
              {
                key: { type: "identifier", value: "a", column: 10 },
                valueType: { type: "string", value: '"Hello"', column: 13 },
              },
              {
                key: { type: "identifier", value: "b", column: 21 },
                valueType: { type: "boolean", value: "true", column: 24 },
              },
              {
                key: { type: "identifier", value: "c", column: 29 },
                valueType: { type: "number", value: "1", column: 32 },
              },
            ],
          },
        });
      });

      it("should parse object assignment with strings and booleans and numbers without new variable declaration", () => {
        const tokens: Token[] = [
          { type: "identifier", value: "x", column: 1 },
          { type: "operator", value: "=", column: 2 },
          { type: "brace", value: "{", column: 4 },
          { type: "identifier", value: "a", column: 5 },
          { type: "operator", value: ":", column: 6 },
          { type: "string", value: '"Hello"', column: 8 },
          { type: "comma", value: ",", column: 15 },
          { type: "identifier", value: "b", column: 16 },
          { type: "operator", value: ":", column: 17 },
          { type: "boolean", value: "true", column: 19 },
          { type: "comma", value: ",", column: 23 },
          { type: "identifier", value: "c", column: 24 },
          { type: "operator", value: ":", column: 25 },
          { type: "number", value: "1", column: 27 },
          { type: "brace", value: "}", column: 28 },
          { type: "semicolon", value: ";", column: 29 },
        ];
        const resultado = AnalizadorSintactico(tokens);
        expect(resultado).toEqual<Assignment>({
          type: "assignment",
          variable: { type: "identifier", value: "x", column: 1 },
          value: {
            type: "object",
            properties: [
              {
                key: { type: "identifier", value: "a", column: 5 },
                valueType: { type: "string", value: '"Hello"', column: 8 },
              },
              {
                key: { type: "identifier", value: "b", column: 16 },
                valueType: { type: "boolean", value: "true", column: 19 },
              },
              {
                key: { type: "identifier", value: "c", column: 24 },
                valueType: { type: "number", value: "1", column: 27 },
              },
            ],
          },
        });
      });
    });
  });

  describe("Binary Operations", () => {
    it("should parse addition operation", () => {
      const tokens: Token[] = [
        { type: "identifier", value: "x", column: 1 },
        { type: "operator", value: "+", column: 2 },
        { type: "number", value: "5", column: 4 },
        { type: "semicolon", value: ";", column: 5 },
      ];

      const resultado = AnalizadorSintactico(tokens);

      expect(resultado).toEqual<BinaryExpression>({
        type: "binary_expression",
        operator: "+",
        left: { type: "identifier", value: "x", column: 1 },
        right: { type: "number", value: "5", column: 4 },
      });
    });

    it("should parse subtraction operation", () => {
      const tokens: Token[] = [
        { type: "identifier", value: "x", column: 1 },
        { type: "operator", value: "-", column: 2 },
        { type: "number", value: "5", column: 4 },
        { type: "semicolon", value: ";", column: 5 },
      ];
      const resultado = AnalizadorSintactico(tokens);
      expect(resultado).toEqual<BinaryExpression>({
        type: "binary_expression",
        operator: "-",
        left: { type: "identifier", value: "x", column: 1 },
        right: { type: "number", value: "5", column: 4 },
      });
    });

    it("should parse multiplication operation", () => {
      const tokens: Token[] = [
        { type: "identifier", value: "x", column: 1 },
        { type: "operator", value: "*", column: 2 },
        { type: "number", value: "5", column: 4 },
        { type: "semicolon", value: ";", column: 5 },
      ];
      const resultado = AnalizadorSintactico(tokens);
      expect(resultado).toEqual<BinaryExpression>({
        type: "binary_expression",
        operator: "*",
        left: { type: "identifier", value: "x", column: 1 },
        right: { type: "number", value: "5", column: 4 },
      });
    });

    it("should parse division operation", () => {
      const tokens: Token[] = [
        { type: "identifier", value: "x", column: 1 },
        { type: "operator", value: "/", column: 2 },
        { type: "number", value: "5", column: 4 },
        { type: "semicolon", value: ";", column: 5 },
      ];
      const resultado = AnalizadorSintactico(tokens);
      expect(resultado).toEqual<BinaryExpression>({
        type: "binary_expression",
        operator: "/",
        left: { type: "identifier", value: "x", column: 1 },
        right: { type: "number", value: "5", column: 4 },
      });
    });

    it("should parse modulo operation", () => {
      const tokens: Token[] = [
        { type: "identifier", value: "x", column: 1 },
        { type: "operator", value: "%", column: 2 },
        { type: "number", value: "5", column: 4 },
        { type: "semicolon", value: ";", column: 5 },
      ];
      const resultado = AnalizadorSintactico(tokens);
      expect(resultado).toEqual<BinaryExpression>({
        type: "binary_expression",
        operator: "%",
        left: { type: "identifier", value: "x", column: 1 },
        right: { type: "number", value: "5", column: 4 },
      });
    });

    it("should parse exponentiation operation", () => {
      const tokens: Token[] = [
        { type: "identifier", value: "x", column: 1 },
        { type: "operator", value: "**", column: 2 },
        { type: "number", value: "5", column: 5 },
        { type: "semicolon", value: ";", column: 6 },
      ];
      const resultado = AnalizadorSintactico(tokens);
      expect(resultado).toEqual<BinaryExpression>({
        type: "binary_expression",
        operator: "**",
        left: { type: "identifier", value: "x", column: 1 },
        right: { type: "number", value: "5", column: 5 },
      });
    });

    it("should parse binary expression with parentheses", () => {
      const tokens: Token[] = [
        { type: "bracket", value: "(", column: 1 },
        { type: "identifier", value: "x", column: 2 },
        { type: "operator", value: "+", column: 3 },
        { type: "number", value: "5", column: 5 },
        { type: "bracket", value: ")", column: 6 },
        { type: "semicolon", value: ";", column: 7 },
      ];

      const resultado = AnalizadorSintactico(tokens);

      expect(resultado).toEqual<BinaryExpression>({
        type: "binary_expression",
        operator: "+",
        left: { type: "identifier", value: "x", column: 2 },
        right: { type: "number", value: "5", column: 5 },
      });
    });

    it("should parse binary expression with multiple operations", () => {
      const tokens: Token[] = [
        { type: "identifier", value: "x", column: 1 },
        { type: "operator", value: "+", column: 2 },
        { type: "number", value: "5", column: 4 },
        { type: "operator", value: "*", column: 6 },
        { type: "number", value: "10", column: 8 },
        { type: "semicolon", value: ";", column: 10 },
      ];

      const resultado = AnalizadorSintactico(tokens);

      expect(resultado).toEqual<BinaryExpression>({
        type: "binary_expression",
        operator: "+",
        left: { type: "identifier", value: "x", column: 1 },
        right: {
          type: "binary_expression",
          operator: "*",
          left: { type: "number", value: "5", column: 4 },
          right: { type: "number", value: "10", column: 8 },
        },
      });
    });

    it("should parse binary expression with multiple operations and parentheses", () => {
      const tokens: Token[] = [
        { type: "bracket", value: "(", column: 1 },
        { type: "identifier", value: "x", column: 2 },
        { type: "operator", value: "+", column: 3 },
        { type: "number", value: "5", column: 5 },
        { type: "bracket", value: ")", column: 6 },
        { type: "operator", value: "*", column: 7 },
        { type: "number", value: "10", column: 9 },
        { type: "semicolon", value: ";", column: 11 },
      ];

      const resultado = AnalizadorSintactico(tokens);

      expect(resultado).toEqual<BinaryExpression>({
        type: "binary_expression",
        operator: "*",
        left: {
          type: "binary_expression",
          operator: "+",
          left: { type: "identifier", value: "x", column: 2 },
          right: { type: "number", value: "5", column: 5 },
        },
        right: { type: "number", value: "10", column: 9 },
      });
    });

    it("should parse binary expression with parenteses at the end", () => {
      const tokens: Token[] = [
        { type: "identifier", value: "x", column: 1 },
        { type: "operator", value: "+", column: 2 },
        { type: "number", value: "5", column: 4 },
        { type: "bracket", value: "(", column: 6 },
        { type: "number", value: "10", column: 7 },
        { type: "operator", value: "+", column: 9 },
        { type: "bracket", value: "(", column: 11 },
        { type: "number", value: "20", column: 12 },
        { type: "operator", value: "-", column: 14 },
        { type: "number", value: "5", column: 16 },
        { type: "bracket", value: ")", column: 17 },
        { type: "bracket", value: ")", column: 18 },
        { type: "semicolon", value: ";", column: 19 },
      ];

      const resultado = AnalizadorSintactico(tokens);

      expect(resultado).toEqual<BinaryExpression>({
        type: "binary_expression",
        operator: "+",
        left: { type: "identifier", value: "x", column: 1 },
        right: {
          type: "binary_expression",
          operator: "+",
          left: { type: "number", value: "5", column: 4 },
          right: {
            type: "binary_expression",
            operator: "-",
            left: { type: "number", value: "20", column: 12 },
            right: { type: "number", value: "5", column: 16 },
          },
        },
      });
    });
  });

  describe("Comparison Operations", () => {
    it("should parse equality operation", () => {
      const tokens: Token[] = [
        { type: "identifier", value: "x", column: 1 },
        { type: "operator", value: "==", column: 2 },
        { type: "number", value: "5", column: 5 },
        { type: "semicolon", value: ";", column: 6 },
      ];

      const resultado = AnalizadorSintactico(tokens);

      expect(resultado).toEqual<ComparisonExpression>({
        type: "comparison_expression",
        operator: "==",
        left: { type: "identifier", value: "x", column: 1 },
        right: { type: "number", value: "5", column: 5 },
      });
    });

    it("should parse inequality operation", () => {
      const tokens: Token[] = [
        { type: "identifier", value: "x", column: 1 },
        { type: "operator", value: "!=", column: 2 },
        { type: "number", value: "5", column: 5 },
        { type: "semicolon", value: ";", column: 6 },
      ];
      const resultado = AnalizadorSintactico(tokens);
      expect(resultado).toEqual<ComparisonExpression>({
        type: "comparison_expression",
        operator: "!=",
        left: { type: "identifier", value: "x", column: 1 },
        right: { type: "number", value: "5", column: 5 },
      });
    });

    it("should parse greater than operation", () => {
      const tokens: Token[] = [
        { type: "identifier", value: "x", column: 1 },
        { type: "operator", value: ">", column: 2 },
        { type: "number", value: "5", column: 4 },
        { type: "semicolon", value: ";", column: 5 },
      ];
      const resultado = AnalizadorSintactico(tokens);
      expect(resultado).toEqual<ComparisonExpression>({
        type: "comparison_expression",
        operator: ">",
        left: { type: "identifier", value: "x", column: 1 },
        right: { type: "number", value: "5", column: 4 },
      });
    });

    it("should parse less than operation", () => {
      const tokens: Token[] = [
        { type: "identifier", value: "x", column: 1 },
        { type: "operator", value: "<", column: 2 },
        { type: "number", value: "5", column: 4 },
        { type: "semicolon", value: ";", column: 5 },
      ];
      const resultado = AnalizadorSintactico(tokens);
      expect(resultado).toEqual<ComparisonExpression>({
        type: "comparison_expression",
        operator: "<",
        left: { type: "identifier", value: "x", column: 1 },
        right: { type: "number", value: "5", column: 4 },
      });
    });

    it("should parse greater than or equal to operation", () => {
      const tokens: Token[] = [
        { type: "identifier", value: "x", column: 1 },
        { type: "operator", value: ">=", column: 2 },
        { type: "number", value: "5", column: 5 },
        { type: "semicolon", value: ";", column: 6 },
      ];
      const resultado = AnalizadorSintactico(tokens);
      expect(resultado).toEqual<ComparisonExpression>({
        type: "comparison_expression",
        operator: ">=",
        left: { type: "identifier", value: "x", column: 1 },
        right: { type: "number", value: "5", column: 5 },
      });
    });

    it("should parse less than or equal to operation", () => {
      const tokens: Token[] = [
        { type: "identifier", value: "x", column: 1 },
        { type: "operator", value: "<=", column: 2 },
        { type: "number", value: "5", column: 5 },
        { type: "semicolon", value: ";", column: 6 },
      ];
      const resultado = AnalizadorSintactico(tokens);
      expect(resultado).toEqual<ComparisonExpression>({
        type: "comparison_expression",
        operator: "<=",
        left: { type: "identifier", value: "x", column: 1 },
        right: { type: "number", value: "5", column: 5 },
      });
    });
  });

  describe("Logical Operations", () => {
    it("should parse logical AND operation", () => {
      const tokens: Token[] = [
        { type: "identifier", value: "x", column: 1 },
        { type: "operator", value: "&&", column: 2 },
        { type: "identifier", value: "y", column: 5 },
        { type: "semicolon", value: ";", column: 6 },
      ];

      const resultado = AnalizadorSintactico(tokens);

      expect(resultado).toEqual<LogicalOperation>({
        type: "logical_operation",
        operator: "&&",
        left: { type: "identifier", value: "x", column: 1 },
        right: { type: "identifier", value: "y", column: 5 },
      });
    });

    it("should parse logical OR operation", () => {
      const tokens: Token[] = [
        { type: "identifier", value: "x", column: 1 },
        { type: "operator", value: "||", column: 2 },
        { type: "identifier", value: "y", column: 5 },
        { type: "semicolon", value: ";", column: 6 },
      ];
      const resultado = AnalizadorSintactico(tokens);
      expect(resultado).toEqual<LogicalOperation>({
        type: "logical_operation",
        operator: "||",
        left: { type: "identifier", value: "x", column: 1 },
        right: { type: "identifier", value: "y", column: 5 },
      });
    });

    it("should parse logical NOT operation", () => {
      const tokens: Token[] = [
        { type: "operator", value: "!", column: 1 },
        { type: "identifier", value: "x", column: 2 },
        { type: "semicolon", value: ";", column: 3 },
      ];

      const resultado = AnalizadorSintactico(tokens);

      expect(resultado).toEqual<LogicalOperation>({
        type: "logical_operation",
        operator: "!",
        left: null,
        right: { type: "identifier", value: "x", column: 2 },
      });
    });

    it("should parse logical NOT operation with binary expression", () => {
      const tokens: Token[] = [
        { type: "operator", value: "!", column: 1 },
        { type: "bracket", value: "(", column: 2 },
        { type: "identifier", value: "x", column: 3 },
        { type: "operator", value: "==", column: 4 },
        { type: "number", value: "5", column: 7 },
        { type: "bracket", value: ")", column: 8 },
        { type: "semicolon", value: ";", column: 9 },
      ];

      const resultado = AnalizadorSintactico(tokens);

      expect(resultado).toEqual<LogicalOperation>({
        type: "logical_operation",
        operator: "!",
        left: null,
        right: {
          type: "binary_expression",
          operator: "==",
          left: { type: "identifier", value: "x", column: 3 },
          right: { type: "number", value: "5", column: 7 },
        },
      });
    });
  });

  describe("If Statement", () => {
    it("should parse if statement", () => {
      const tokens: Token[] = [
        { type: "keyword", value: "if", column: 1 },
        { type: "bracket", value: "(", column: 3 },
        { type: "identifier", value: "x", column: 4 },
        { type: "operator", value: "==", column: 5 },
        { type: "number", value: "5", column: 8 },
        { type: "bracket", value: ")", column: 9 },
        { type: "brace", value: "{", column: 11 },
        { type: "identifier", value: "x", column: 12 },
        { type: "operator", value: "=", column: 13 },
        { type: "number", value: "10", column: 15 },
        { type: "semicolon", value: ";", column: 17 },
        { type: "brace", value: "}", column: 18 },
        { type: "semicolon", value: ";", column: 19 },
      ];

      const resultado = AnalizadorSintactico(tokens);

      expect(resultado).toEqual<IfStatement>({
        type: "if_statement",
        condition: {
          type: "comparison_expression",
          operator: "==",
          left: { type: "identifier", value: "x", column: 4 },
          right: { type: "number", value: "5", column: 8 },
        },
        body: [
          {
            type: "assignment",
            variable: { type: "identifier", value: "x", column: 12 },
            value: { type: "number", value: "10", column: 15 },
          },
        ],
      });
    });

    it("Should parse if statement with else", () => {
      const tokens: Token[] = [
        { type: "keyword", value: "if", column: 1 },
        { type: "bracket", value: "(", column: 3 },
        { type: "identifier", value: "x", column: 4 },
        { type: "operator", value: "==", column: 5 },
        { type: "number", value: "5", column: 8 },
        { type: "bracket", value: ")", column: 9 },
        { type: "brace", value: "{", column: 11 },
        { type: "identifier", value: "x", column: 12 },
        { type: "operator", value: "=", column: 13 },
        { type: "number", value: "10", column: 15 },
        { type: "semicolon", value: ";", column: 17 },
        { type: "brace", value: "}", column: 18 },
        { type: "keyword", value: "else", column: 20 },
        { type: "brace", value: "{", column: 25 },
        { type: "identifier", value: "x", column: 26 },
        { type: "operator", value: "=", column: 27 },
        { type: "number", value: "0", column: 29 },
        { type: "semicolon", value: ";", column: 30 },
        { type: "brace", value: "}", column: 31 },
      ];

      const resultado = AnalizadorSintactico(tokens);

      expect(resultado).toEqual<IfStatement>({
        type: "if_statement",
        condition: {
          type: "comparison_expression",
          operator: "==",
          left: { type: "identifier", value: "x", column: 4 },
          right: { type: "number", value: "5", column: 8 },
        },
        body: [
          {
            type: "assignment",
            variable: { type: "identifier", value: "x", column: 12 },
            value: { type: "number", value: "10", column: 15 },
          },
        ],
        elseBody: [
          {
            type: "assignment",
            variable: { type: "identifier", value: "x", column: 26 },
            value: { type: "number", value: "0", column: 29 },
          },
        ],
      });
    });

    it("should parse if statement with else if", () => {
      const tokens: Token[] = [
        { type: "keyword", value: "if", column: 1 },
        { type: "bracket", value: "(", column: 3 },
        { type: "identifier", value: "x", column: 4 },
        { type: "operator", value: "==", column: 5 },
        { type: "number", value: "5", column: 8 },
        { type: "bracket", value: ")", column: 9 },
        { type: "brace", value: "{", column: 11 },
        { type: "identifier", value: "x", column: 12 },
        { type: "operator", value: "=", column: 13 },
        { type: "number", value: "10", column: 15 },
        { type: "semicolon", value: ";", column: 17 },
        { type: "brace", value: "}", column: 18 },
        { type: "keyword", value: "else if", column: 20 },
        { type: "bracket", value: "(", column: 28 },
        { type: "identifier", value: "y", column: 29 },
        { type: "operator", value: "<=", column: 30 },
        { type: "number", value: "0", column: 33 },
        { type: "bracket", value: ")", column: 34 },
        { type: "brace", value: "{", column: 36 },
        { type: "identifier", value: "y", column: 37 },
        { type: "operator", value: "+=", column: 38 },
        { type: "number", value: "-1", column: 41 },
        { type: "semicolon", value: ";", column: 43 },
        { type: "brace", value: "}", column: 44 },
      ];

      const resultado = AnalizadorSintactico(tokens);

      expect(resultado).toEqual<IfStatement>({
        type: "if_statement",
        condition: {
          type: "comparison_expression",
          operator: "==",
          left: { type: "identifier", value: "x", column: 4 },
          right: { type: "number", value: "5", column: 8 },
        },
        body: [
          {
            type: "assignment",
            variable: { type: "identifier", value: "x", column: 12 },
            value: { type: "number", value: "10", column: 15 },
          },
        ],
        elseIf: {
          type: "if_statement",
          condition: {
            type: "comparison_expression",
            operator: "<=",
            left: { type: "identifier", value: "y", column: 29 },
            right: { type: "number", value: "0", column: 33 },
          },
          body: [
            {
              type: "assignment",
              variable: { type: "identifier", value: "y", column: 37 },
              value: {
                type: "binary_expression",
                operator: "+",
                left: { type: "identifier", value: "y", column: 37 },
                right: { type: "number", value: "-1", column: 41 },
              },
            },
          ],
        },
      });
    });

    it("should parse if statement with nested if statement", () => {
      const tokens: Token[] = [
        { type: "keyword", value: "if", column: 1 },
        { type: "bracket", value: "(", column: 3 },
        { type: "identifier", value: "x", column: 4 },
        { type: "operator", value: "==", column: 5 },
        { type: "number", value: "5", column: 8 },
        { type: "bracket", value: ")", column: 9 },
        { type: "brace", value: "{", column: 11 },
        { type: "keyword", value: "if", column: 12 },
        { type: "bracket", value: "(", column: 14 },
        { type: "identifier", value: "y", column: 15 },
        { type: "operator", value: "<=", column: 16 },
        { type: "number", value: "0", column: 19 },
        { type: "bracket", value: ")", column: 20 },
        { type: "brace", value: "{", column: 22 },
        { type: "identifier", value: "y", column: 23 },
        { type: "operator", value: "+=", column: 24 },
        { type: "number", value: "-1", column: 27 },
        { type: "semicolon", value: ";", column: 29 },
        { type: "brace", value: "}", column: 30 },
        { type: "brace", value: "}", column: 31 },
      ];

      const resultado = AnalizadorSintactico(tokens);

      expect(resultado).toEqual<IfStatement>({
        type: "if_statement",
        condition: {
          type: "comparison_expression",
          operator: "==",
          left: { type: "identifier", value: "x", column: 4 },
          right: { type: "number", value: "5", column: 8 },
        },
        body: [
          {
            type: "if_statement",
            condition: {
              type: "comparison_expression",
              operator: "<=",
              left: { type: "identifier", value: "y", column: 15 },
              right: { type: "number", value: "0", column: 19 },
            },
            body: [
              {
                type: "assignment",
                variable: { type: "identifier", value: "y", column: 23 },
                value: {
                  type: "binary_expression",
                  operator: "+",
                  left: { type: "identifier", value: "y", column: 23 },
                  right: { type: "number", value: "-1", column: 27 },
                },
              },
            ],
          },
        ],
      });
    });
  });

  describe("Function", () => {
    it("should parse function declaration", () => {
      const tokens: Token[] = [
        { type: "keyword", value: "function", column: 1 },
        { type: "identifier", value: "myFunction", column: 9 },
        { type: "bracket", value: "(", column: 20 },
        { type: "bracket", value: ")", column: 21 },
        { type: "brace", value: "{", column: 23 },
        { type: "brace", value: "}", column: 24 },
      ];

      const resultado = AnalizadorSintactico(tokens);

      expect(resultado).toEqual<FunctionDeclaration>({
        type: "function_declaration",
        name: { type: "identifier", value: "myFunction", column: 9 },
        parameters: [],
        body: [],
      });
    });

    it("should parse function declaration with parameters and body", () => {
      const tokens: Token[] = [
        { type: "keyword", value: "function", column: 1 },
        { type: "identifier", value: "myFunction", column: 9 },
        { type: "bracket", value: "(", column: 20 },
        { type: "identifier", value: "a", column: 21 },
        { type: "comma", value: ",", column: 22 },
        { type: "identifier", value: "b", column: 23 },
        { type: "bracket", value: ")", column: 24 },
        { type: "brace", value: "{", column: 26 },
        { type: "keyword", value: "return", column: 27 },
        { type: "identifier", value: "a", column: 33 },
        { type: "operator", value: "+", column: 34 },
        { type: "identifier", value: "b", column: 36 },
        { type: "semicolon", value: ";", column: 37 },
        { type: "brace", value: "}", column: 38 },
      ];
      const resultado = AnalizadorSintactico(tokens);
      expect(resultado).toEqual<FunctionDeclaration>({
        type: "function_declaration",
        name: { type: "identifier", value: "myFunction", column: 9 },
        parameters: [
          { type: "identifier", value: "a", column: 21 },
          { type: "identifier", value: "b", column: 23 },
        ],
        body: [
          {
            type: "return_statement",
            value: {
              type: "binary_expression",
              operator: "+",
              left: { type: "identifier", value: "a", column: 33 },
              right: { type: "identifier", value: "b", column: 36 },
            },
          },
        ],
      });
    });

    it("should parse function call", () => {
      const tokens: Token[] = [
        { type: "identifier", value: "myFunction", column: 1 },
        { type: "bracket", value: "(", column: 11 },
        { type: "number", value: "5", column: 12 },
        { type: "comma", value: ",", column: 13 },
        { type: "number", value: "10", column: 14 },
        { type: "bracket", value: ")", column: 16 },
        { type: "semicolon", value: ";", column: 17 },
      ];

      const resultado = AnalizadorSintactico(tokens);

      expect(resultado).toEqual<FunctionCall>({
        type: "function_call",
        name: { type: "identifier", value: "myFunction", column: 1 },
        arguments: [
          { type: "number", value: "5", column: 12 },
          { type: "number", value: "10", column: 14 },
        ],
      });
    });

    it("should parse function call with no arguments", () => {
      const tokens: Token[] = [
        { type: "identifier", value: "myFunction", column: 1 },
        { type: "bracket", value: "(", column: 11 },
        { type: "bracket", value: ")", column: 12 },
        { type: "semicolon", value: ";", column: 13 },
      ];

      const resultado = AnalizadorSintactico(tokens);

      expect(resultado).toEqual<FunctionCall>({
        type: "function_call",
        name: { type: "identifier", value: "myFunction", column: 1 },
        arguments: [],
      });
    });

    it("should parse function call with nested function call", () => {
      const tokens: Token[] = [
        { type: "identifier", value: "myFunction", column: 1 },
        { type: "bracket", value: "(", column: 11 },
        { type: "number", value: "5", column: 12 },
        { type: "comma", value: ",", column: 13 },
        { type: "identifier", value: "anotherFunction", column: 14 },
        { type: "bracket", value: "(", column: 29 },
        { type: "number", value: "10", column: 30 },
        { type: "bracket", value: ")", column: 32 },
        { type: "bracket", value: ")", column: 33 },
        { type: "semicolon", value: ";", column: 34 },
      ];

      const resultado = AnalizadorSintactico(tokens);

      expect(resultado).toEqual<FunctionCall>({
        type: "function_call",
        name: { type: "identifier", value: "myFunction", column: 1 },
        arguments: [
          { type: "number", value: "5", column: 12 },
          {
            type: "function_call",
            name: { type: "identifier", value: "anotherFunction", column: 14 },
            arguments: [{ type: "number", value: "10", column: 30 }],
          },
        ],
      });
    });
  });
});
