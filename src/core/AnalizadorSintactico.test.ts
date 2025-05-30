import Token from "../types/Token";
import AnalizadorSintactico from "./AnalizadorSintactico";
import type {
  BodyStatement,
  ComparisonExpression,
  ErrorDefinition,
} from "../types/AST";

describe("AnalizadorSintactico", () => {
  describe("Variables", () => {
    it("Deberia parsera una declaracion de variable", () => {
      const tokens: Token[][] = [
        [
          { type: "keyword", value: "let", column: 0 },
          { type: "identifier", value: "x", column: 4 },
        ],
      ];
      const result = AnalizadorSintactico(tokens);
      const expected: BodyStatement = [
        {
          type: "new_variable_declaration",
          variable: {
            type: "identifier",
            value: "x",
            column: 4,
          },
        },
      ];
      expect(result).toEqual(expected);
    });

    it("Deberia parsear una declaracion de variable numerica", () => {
      const tokens: Token[][] = [
        [
          { type: "keyword", value: "let", column: 0 },
          { type: "identifier", value: "x", column: 4 },
          { type: "operator", value: "=", column: 6 },
          { type: "number", value: "10", column: 8 },
        ],
      ];

      const result = AnalizadorSintactico(tokens);
      const expected: BodyStatement = [
        {
          type: "new_variable_declaration_assignment",
          variable: {
            type: "identifier",
            value: "x",
            column: 4,
          },
          value: {
            column: 8,
            type: "number",
            value: "10",
          },
        },
      ];
      expect(result).toEqual(expected);
    });

    it("Deberia parsear una declaracion de variable string", () => {
      const tokens: Token[][] = [
        [
          { type: "keyword", value: "let", column: 0 },
          { type: "identifier", value: "x", column: 4 },
          { type: "operator", value: "=", column: 6 },
          { type: "string", value: '"hello"', column: 8 },
        ],
      ];

      const result = AnalizadorSintactico(tokens);
      const expected: BodyStatement = [
        {
          type: "new_variable_declaration_assignment",
          variable: {
            type: "identifier",
            value: "x",
            column: 4,
          },
          value: {
            column: 8,
            type: "string",
            value: '"hello"',
          },
        },
      ];
      expect(result).toEqual(expected);
    });

    it("Deberia parsear una declaracion de variable boolean", () => {
      const tokens: Token[][] = [
        [
          { type: "keyword", value: "let", column: 0 },
          { type: "identifier", value: "x", column: 4 },
          { type: "operator", value: "=", column: 6 },
          { type: "boolean", value: "true", column: 8 },
        ],
      ];

      const result = AnalizadorSintactico(tokens);
      const expected: BodyStatement = [
        {
          type: "new_variable_declaration_assignment",
          variable: {
            type: "identifier",
            value: "x",
            column: 4,
          },
          value: {
            column: 8,
            type: "boolean",
            value: "true",
          },
        },
      ];
      expect(result).toEqual(expected);
    });

    it("Deberia parsear una variable constante", () => {
      const tokens: Token[][] = [
        [
          { type: "keyword", value: "const", column: 0 },
          { type: "identifier", value: "x", column: 6 },
          { type: "operator", value: "=", column: 8 },
          { type: "number", value: "10", column: 10 },
        ],
      ];

      const result = AnalizadorSintactico(tokens);
      const expected: BodyStatement = [
        {
          type: "new_variable_declaration_assignment",
          variable: {
            type: "identifier",
            value: "x",
            column: 6,
          },
          value: {
            column: 10,
            type: "number",
            value: "10",
          },
        },
      ];
      expect(result).toEqual(expected);
    });

    describe("Errores de variables", () => {
      it("Deberia lanzar error si la variable constante no tiene valor", () => {
        const tokens: Token[][] = [
          [
            { type: "keyword", value: "const", column: 0 },
            { type: "identifier", value: "x", column: 6 },
          ],
        ];

        const error: ErrorDefinition = {
          type: "SyntaxError",
          message: "La variable constante no tiene valor",
          column: 6,
          line: 1,
        };

        expect(AnalizadorSintactico(tokens)).toEqual(error);
      });

      it("Deberia lanzar error con una cadena desconocida", () => {
        const tokens: Token[][] = [
          [
            { type: "keyword", value: "let", column: 0 },
            { type: "identifier", value: "x", column: 4 },
            { type: "operator", value: "=", column: 6 },
            { type: "unknown", value: "@", column: 8 },
          ],
        ];

        const error: ErrorDefinition = {
          type: "SyntaxError",
          message: "Token desconocido",
          column: 8,
          line: 1,
        };

        expect(AnalizadorSintactico(tokens)).toEqual(error);
      });

      it("Deberia lanzar error con una asignacion de un keyword", () => {
        const tokens: Token[][] = [
          [
            { type: "keyword", value: "let", column: 0 },
            { type: "identifier", value: "x", column: 4 },
            { type: "operator", value: "=", column: 6 },
            { type: "keyword", value: "if", column: 8 },
          ],
        ];

        const error: ErrorDefinition = {
          type: "SyntaxError",
          message: "No se puede asignar un keyword",
          column: 8,
          line: 1,
        };

        expect(AnalizadorSintactico(tokens)).toEqual(error);
      });
    });
  });

  describe("Operadores Aritmeticos", () => {
    it("Deberia parsear multiples operadores", () => {
      const tokens: Token[][] = [
        [
          { type: "number", value: "10", column: 0 },
          { type: "operator", value: "+", column: 2 },
          { type: "number", value: "20", column: 4 },
          { type: "operator", value: "*", column: 6 },
          { type: "number", value: "30", column: 8 },
        ],
      ];

      const result = AnalizadorSintactico(tokens);
      const expected: BodyStatement = [
        {
          type: "binary_expression",
          operator: "*",
          left: {
            type: "binary_expression",
            operator: "+",
            left: {
              type: "number",
              value: "10",
              column: 0,
            },
            right: {
              type: "number",
              value: "20",
              column: 4,
            },
          },
          right: {
            type: "number",
            value: "30",
            column: 8,
          },
        },
      ];
      expect(result).toEqual(expected);
    });

    describe.each(["+", "-", "*", "/", "%"])(
      "Casos comunes para el operador %s",
      (operator) => {
        it(`Deberia parsear el operador "${operator}" con dos numeros`, () => {
          const tokens: Token[][] = [
            [
              { type: "number", value: "10", column: 0 },
              { type: "operator", value: operator, column: 2 },
              { type: "number", value: "20", column: 4 },
            ],
          ];

          const result = AnalizadorSintactico(tokens);
          const expected: BodyStatement = [
            {
              type: "binary_expression",
              operator: operator,
              left: {
                type: "number",
                value: "10",
                column: 0,
              },
              right: {
                type: "number",
                value: "20",
                column: 4,
              },
            },
          ];
          expect(result).toEqual(expected);
        });

        it(`Deberia parsear el operador "${operator}" con dos strings`, () => {
          const tokens: Token[][] = [
            [
              { type: "string", value: '"10"', column: 0 },
              { type: "operator", value: operator, column: 4 },
              { type: "string", value: '"20"', column: 6 },
            ],
          ];

          const result = AnalizadorSintactico(tokens);
          const expected: BodyStatement = [
            {
              type: "binary_expression",
              operator: operator,
              left: {
                type: "string",
                value: '"10"',
                column: 0,
              },
              right: {
                type: "string",
                value: '"20"',
                column: 6,
              },
            },
          ];
          expect(result).toEqual(expected);
        });

        it(`Deberia parsear el operador "${operator}" con dos booleans`, () => {
          const tokens: Token[][] = [
            [
              { type: "boolean", value: "true", column: 0 },
              { type: "operator", value: operator, column: 5 },
              { type: "boolean", value: "false", column: 7 },
            ],
          ];

          const result = AnalizadorSintactico(tokens);
          const expected: BodyStatement = [
            {
              type: "binary_expression",
              operator: operator,
              left: {
                type: "boolean",
                value: "true",
                column: 0,
              },
              right: {
                type: "boolean",
                value: "false",
                column: 7,
              },
            },
          ];
          expect(result).toEqual(expected);
        });

        it(`Deberia parsear el operador "${operator}" con un identificador y un numero`, () => {
          const tokens: Token[][] = [
            [
              { type: "identifier", value: "x", column: 0 },
              { type: "operator", value: operator, column: 2 },
              { type: "number", value: "20", column: 4 },
            ],
          ];

          const result = AnalizadorSintactico(tokens);
          const expected: BodyStatement = [
            {
              type: "binary_expression",
              operator: operator,
              left: {
                type: "identifier",
                value: "x",
                column: 0,
              },
              right: {
                type: "number",
                value: "20",
                column: 4,
              },
            },
          ];
          expect(result).toEqual(expected);
        });

        it(`Deberia parsear el operador "${operator}" con un identificador y un string`, () => {
          const tokens: Token[][] = [
            [
              { type: "identifier", value: "x", column: 0 },
              { type: "operator", value: operator, column: 2 },
              { type: "string", value: '"20"', column: 4 },
            ],
          ];

          const result = AnalizadorSintactico(tokens);
          const expected: BodyStatement = [
            {
              type: "binary_expression",
              operator: operator,
              left: {
                type: "identifier",
                value: "x",
                column: 0,
              },
              right: {
                type: "string",
                value: '"20"',
                column: 4,
              },
            },
          ];
          expect(result).toEqual(expected);
        });

        it(`Deberia parsear el operador "${operator}" con un identificador y un boolean`, () => {
          const tokens: Token[][] = [
            [
              { type: "identifier", value: "x", column: 0 },
              { type: "operator", value: operator, column: 2 },
              { type: "boolean", value: "true", column: 4 },
            ],
          ];

          const result = AnalizadorSintactico(tokens);
          const expected: BodyStatement = [
            {
              type: "binary_expression",
              operator: operator,
              left: {
                type: "identifier",
                value: "x",
                column: 0,
              },
              right: {
                type: "boolean",
                value: "true",
                column: 4,
              },
            },
          ];
          expect(result).toEqual(expected);
        });

        it(`Deberia parsear el operador "${operator}" con un numero y un identificador`, () => {
          const tokens: Token[][] = [
            [
              { type: "number", value: "10", column: 0 },
              { type: "operator", value: operator, column: 2 },
              { type: "identifier", value: "x", column: 4 },
            ],
          ];

          const result = AnalizadorSintactico(tokens);
          const expected: BodyStatement = [
            {
              type: "binary_expression",
              operator: operator,
              left: {
                type: "number",
                value: "10",
                column: 0,
              },
              right: {
                type: "identifier",
                value: "x",
                column: 4,
              },
            },
          ];
          expect(result).toEqual(expected);
        });

        it(`Deberia lanzar error con una cadena desconocida`, () => {
          const tokens: Token[][] = [
            [
              { type: "unknown", value: "@#", column: 0 },
              { type: "operator", value: operator, column: 4 },
              { type: "number", value: "20", column: 6 },
            ],
          ];
          const error: ErrorDefinition = {
            type: "SyntaxError",
            message: "No se puede usar un token desconocido",
            column: 0,
            line: 1,
          };
          expect(AnalizadorSintactico(tokens)).toEqual(error);
        });

        it(`Deberia lanzar error al operar keywords`, () => {
          const tokens: Token[][] = [
            [
              { type: "number", value: "10", column: 0 },
              { type: "operator", value: operator, column: 2 },
              { type: "keyword", value: "if", column: 4 },
            ],
          ];
          const error: ErrorDefinition = {
            type: "SyntaxError",
            message: `No se puede usar un keyword como operando`,
            column: 4,
            line: 1,
          };
          expect(AnalizadorSintactico(tokens)).toEqual(error);
        });
      }
    );
  });

  describe("Operadores de Comparacion", () => {
    describe.each(["<", ">", "<=", ">=", "==", "!="] as Pick<
      ComparisonExpression,
      "operator"
    >["operator"][])("Casos comunes del operador %s", (operator) => {
      it(`Deberia parsear el operador ${operator} con numeros`, () => {
        const tokens: Token[][] = [
          [
            { type: "number", value: "10", column: 0 },
            { type: "operator", value: operator, column: 2 },
            { type: "number", value: "20", column: 4 },
          ],
        ];
        const result = AnalizadorSintactico(tokens);
        const expected: BodyStatement = [
          {
            type: "comparison_expression",
            operator: operator,
            left: {
              type: "number",
              value: "10",
              column: 0,
            },
            right: {
              type: "number",
              value: "20",
              column: 4,
            },
          },
        ];
        expect(result).toEqual(expected);
      });

      it(`Deberia parsear el operador ${operator} con strings`, () => {
        const tokens: Token[][] = [
          [
            { type: "string", value: '"10"', column: 0 },
            { type: "operator", value: operator, column: 4 },
            { type: "string", value: '"20"', column: 6 },
          ],
        ];
        const result = AnalizadorSintactico(tokens);
        const expected: BodyStatement = [
          {
            type: "comparison_expression",
            operator: operator,
            left: {
              type: "string",
              value: '"10"',
              column: 0,
            },
            right: {
              type: "string",
              value: '"20"',
              column: 6,
            },
          },
        ];
        expect(result).toEqual(expected);
      });

      it(`Deberia parsear el operador ${operator} con booleans`, () => {
        const tokens: Token[][] = [
          [
            { type: "boolean", value: "true", column: 0 },
            { type: "operator", value: operator, column: 5 },
            { type: "boolean", value: "false", column: 7 },
          ],
        ];
        const result = AnalizadorSintactico(tokens);
        const expected: BodyStatement = [
          {
            type: "comparison_expression",
            operator: operator,
            left: {
              type: "boolean",
              value: "true",
              column: 0,
            },
            right: {
              type: "boolean",
              value: "false",
              column: 7,
            },
          },
        ];
        expect(result).toEqual(expected);
      });

      it(`Deberia parsear el operador ${operator} con identificadores`, () => {
        const tokens: Token[][] = [
          [
            { type: "identifier", value: "x", column: 0 },
            { type: "operator", value: operator, column: 2 },
            { type: "identifier", value: "y", column: 4 },
          ],
        ];
        const result = AnalizadorSintactico(tokens);
        const expected: BodyStatement = [
          {
            type: "comparison_expression",
            operator: operator,
            left: {
              type: "identifier",
              value: "x",
              column: 0,
            },
            right: {
              type: "identifier",
              value: "y",
              column: 4,
            },
          },
        ];
        expect(result).toEqual(expected);
      });

      it(`Deberia lanzar error al operar keywords`, () => {
        const tokens: Token[][] = [
          [
            { type: "number", value: "10", column: 0 },
            { type: "operator", value: operator, column: 2 },
            { type: "keyword", value: "if", column: 4 },
          ],
        ];
        const error: ErrorDefinition = {
          type: "SyntaxError",
          message: `No se puede usar un keyword como operando`,
          column: 4,
          line: 1,
        };
        expect(AnalizadorSintactico(tokens)).toEqual(error);
      });

      it(`Deberia lanzar error con una cadena desconocida`, () => {
        const tokens: Token[][] = [
          [
            { type: "unknown", value: "@#", column: 0 },
            { type: "operator", value: operator, column: 4 },
            { type: "number", value: "20", column: 6 },
          ],
        ];
        const error: ErrorDefinition = {
          type: "SyntaxError",
          message: "No se puede usar un token desconocido",
          column: 0,
          line: 1,
        };
        expect(AnalizadorSintactico(tokens)).toEqual(error);
      });
    });
  });

  describe("Operadores logicos", () => {
    it("Deberia parsear el operador &&", () => {
      const tokens: Token[][] = [
        [
          { type: "boolean", value: "true", column: 0 },
          { type: "operator", value: "&&", column: 5 },
          { type: "boolean", value: "false", column: 8 },
        ],
      ];

      const result = AnalizadorSintactico(tokens);
      const expected: BodyStatement = [
        {
          type: "logical_operation",
          operator: "&&",
          left: {
            type: "boolean",
            value: "true",
            column: 0,
          },
          right: {
            type: "boolean",
            value: "false",
            column: 8,
          },
        },
      ];
      expect(result).toEqual(expected);
    });

    it("Deberia parsear el operador ||", () => {
      const tokens: Token[][] = [
        [
          { type: "boolean", value: "true", column: 0 },
          { type: "operator", value: "||", column: 5 },
          { type: "boolean", value: "false", column: 8 },
        ],
      ];

      const result = AnalizadorSintactico(tokens);
      const expected: BodyStatement = [
        {
          type: "logical_operation",
          operator: "||",
          left: {
            type: "boolean",
            value: "true",
            column: 0,
          },
          right: {
            type: "boolean",
            value: "false",
            column: 8,
          },
        },
      ];
      expect(result).toEqual(expected);
    });

    it("Deberia parsear el operador !", () => {
      const tokens: Token[][] = [
        [
          { type: "operator", value: "!", column: 0 },
          { type: "boolean", value: "true", column: 1 },
        ],
      ];

      const result = AnalizadorSintactico(tokens);
      const expected: BodyStatement = [
        {
          type: "logical_operation",
          operator: "!",
          left: {
            type: "boolean",
            value: "true",
            column: 1,
          },
        },
      ];
      expect(result).toEqual(expected);
    });

    it("Deberia parsear un identificador con un operador logico", () => {
      const tokens: Token[][] = [
        [
          { type: "identifier", value: "x", column: 0 },
          { type: "operator", value: "&&", column: 2 },
          { type: "identifier", value: "y", column: 5 },
        ],
      ];

      const result = AnalizadorSintactico(tokens);
      const expected: BodyStatement = [
        {
          type: "logical_operation",
          operator: "&&",
          left: {
            type: "identifier",
            value: "x",
            column: 0,
          },
          right: {
            type: "identifier",
            value: "y",
            column: 5,
          },
        },
      ];
      expect(result).toEqual(expected);
    });

    it("Deberia parsear multiples operadores logicos", () => {
      const tokens: Token[][] = [
        [
          { type: "boolean", value: "true", column: 0 },
          { type: "operator", value: "&&", column: 5 },
          { type: "boolean", value: "false", column: 8 },
          { type: "operator", value: "||", column: 14 },
          { type: "boolean", value: "true", column: 17 },
        ],
      ];

      const result = AnalizadorSintactico(tokens);
      const expected: BodyStatement = [
        {
          type: "logical_operation",
          operator: "||",
          left: {
            type: "logical_operation",
            operator: "&&",
            left: {
              type: "boolean",
              value: "true",
              column: 0,
            },
            right: {
              type: "boolean",
              value: "false",
              column: 8,
            },
          },
          right: {
            type: "boolean",
            value: "true",
            column: 17,
          },
        },
      ];
      expect(result).toEqual(expected);
    });

    it("Deberia parsear un operador logico con un operador de comparacion", () => {
      const tokens: Token[][] = [
        [
          { type: "number", value: "10", column: 0 },
          { type: "operator", value: "<", column: 2 },
          { type: "number", value: "20", column: 4 },
          { type: "operator", value: "&&", column: 6 },
          { type: "boolean", value: "true", column: 9 },
        ],
      ];

      const result = AnalizadorSintactico(tokens);
      const expected: BodyStatement = [
        {
          type: "logical_operation",
          operator: "&&",
          left: {
            type: "comparison_expression",
            operator: "<",
            left: {
              type: "number",
              value: "10",
              column: 0,
            },
            right: {
              type: "number",
              value: "20",
              column: 4,
            },
          },
          right: {
            type: "boolean",
            value: "true",
            column: 9,
          },
        },
      ];
      expect(result).toEqual(expected);
    });

    it("Deberia lanzar error con una cadena desconocida", () => {
      const tokens: Token[][] = [
        [
          { type: "unknown", value: "@#", column: 0 },
          { type: "operator", value: "&&", column: 4 },
          { type: "boolean", value: "false", column: 6 },
        ],
      ];
      const error: ErrorDefinition = {
        type: "SyntaxError",
        message: "No se puede usar un token desconocido",
        column: 0,
        line: 1,
      };
      expect(AnalizadorSintactico(tokens)).toEqual(error);
    });

    it("Deberia lanzar error al operar keywords", () => {
      const tokens: Token[][] = [
        [
          { type: "number", value: "10", column: 0 },
          { type: "operator", value: "&&", column: 2 },
          { type: "keyword", value: "if", column: 4 },
        ],
      ];
      const error: ErrorDefinition = {
        type: "SyntaxError",
        message: `No se puede usar un keyword como operando`,
        column: 4,
        line: 1,
      };
      expect(AnalizadorSintactico(tokens)).toEqual(error);
    });
  });

  describe("Sentencias if", () => {
    it("Deberia parsear una sentencia correctamente", () => {
      const tokens: Token[][] = [
        [
          { type: "keyword", value: "if", column: 0 },
          { type: "identifier", value: "x", column: 2 },
          { type: "operator", value: "==", column: 4 },
          { type: "number", value: "10", column: 7 },
          { type: "punctuation", value: ":", column: 9 },
        ],
        [
          { type: "keyword", value: "print", column: 2 },
          { type: "string", value: '"Es 10"', column: 8 },
        ],
      ];
      const result = AnalizadorSintactico(tokens);
      const expected: BodyStatement = [
        {
          type: "if_statement",
          condition: {
            type: "comparison_expression",
            operator: "==",
            left: {
              type: "identifier",
              value: "x",
              column: 2,
            },
            right: {
              type: "number",
              value: "10",
              column: 7,
            },
          },
          body: [
            {
              type: "print_statement",
              argument: {
                type: "string",
                value: '"Es 10"',
                column: 8,
              },
            },
          ],
        },
      ];
      expect(result).toEqual(expected);
    });

    it("Deberia parsear una sentencia else", () => {
      const tokens: Token[][] = [
        [
          { type: "keyword", value: "if", column: 0 },
          { type: "identifier", value: "x", column: 2 },
          { type: "operator", value: "==", column: 4 },
          { type: "number", value: "10", column: 7 },
          { type: "punctuation", value: ":", column: 9 },
        ],
        [
          { type: "keyword", value: "print", column: 2 },
          { type: "string", value: '"Es 10"', column: 8 },
        ],
        [
          { type: "keyword", value: "else", column: 0 },
          { type: "punctuation", value: ":", column: 4 },
        ],
        [
          { type: "keyword", value: "print", column: 2 },
          { type: "string", value: '"No es 10"', column: 8 },
        ],
      ];
      const result = AnalizadorSintactico(tokens);
      const expected: BodyStatement = [
        {
          type: "if_statement",
          condition: {
            type: "comparison_expression",
            operator: "==",
            left: {
              type: "identifier",
              value: "x",
              column: 2,
            },
            right: {
              type: "number",
              value: "10",
              column: 7,
            },
          },
          body: [
            {
              type: "print_statement",
              argument: {
                type: "string",
                value: '"Es 10"',
                column: 8,
              },
            },
          ],
          elseBody: [
            {
              type: "print_statement",
              argument: {
                type: "string",
                value: '"No es 10"',
                column: 8,
              },
            },
          ],
        },
      ];
      expect(result).toEqual(expected);
    });

    it("Deberia parsear una sentencia if con else if", () => {
      const tokens: Token[][] = [
        [
          { type: "keyword", value: "if", column: 0 },
          { type: "identifier", value: "x", column: 2 },
          { type: "operator", value: "==", column: 4 },
          { type: "number", value: "10", column: 7 },
          { type: "punctuation", value: ":", column: 9 },
        ],
        [
          { type: "keyword", value: "print", column: 2 },
          { type: "string", value: '"Es 10"', column: 8 },
        ],
        [
          { type: "keyword", value: "else", column: 0 },
          { type: "keyword", value: "if", column: 4 },
          { type: "identifier", value: "y", column: 7 },
          { type: "operator", value: "<=", column: 9 },
          { type: "number", value: "20", column: 12 },
          { type: "punctuation", value: ":", column: 14 },
        ],
        [
          { type: "keyword", value: "print", column: 2 },
          { type: "string", value: '"Es menor o igual a 20"', column: 8 },
        ],
      ];
      const result = AnalizadorSintactico(tokens);
      const expected: BodyStatement = [
        {
          type: "if_statement",
          condition: {
            type: "comparison_expression",
            operator: "==",
            left: {
              type: "identifier",
              value: "x",
              column: 2,
            },
            right: {
              type: "number",
              value: "10",
              column: 7,
            },
          },
          body: [
            {
              type: "print_statement",
              argument: {
                type: "string",
                value: '"Es 10"',
                column: 8,
              },
            },
          ],
          elseIf: {
            type: "if_statement",
            condition: {
              type: "comparison_expression",
              operator: "<=",
              left: {
                type: "identifier",
                value: "y",
                column: 7,
              },
              right: {
                type: "number",
                value: "20",
                column: 12,
              },
            },
            body: [
              {
                type: "print_statement",
                argument: {
                  type: "string",
                  value: '"Es menor o igual a 20"',
                  column: 8,
                },
              },
            ],
          },
        },
      ];
      expect(result).toEqual(expected);
    });

    it("Deberia parsear una sentencia con un operador logico", () => {
      const tokens: Token[][] = [
        [
          { type: "keyword", value: "if", column: 0 },
          { type: "identifier", value: "x", column: 2 },
          { type: "operator", value: "&&", column: 8 },
          { type: "identifier", value: "y", column: 11 },
          { type: "punctuation", value: ":", column: 12 },
        ],
        [
          { type: "keyword", value: "print", column: 2 },
          { type: "string", value: '"Es 10"', column: 8 },
        ],
      ];
      const result = AnalizadorSintactico(tokens);

      const expected: BodyStatement = [
        {
          type: "if_statement",
          condition: {
            type: "logical_operation",
            operator: "&&",
            left: {
              type: "identifier",
              value: "x",
              column: 2,
            },
            right: {
              type: "identifier",
              value: "y",
              column: 11,
            },
          },
          body: [
            {
              type: "print_statement",
              argument: {
                type: "string",
                value: '"Es 10"',
                column: 8,
              },
            },
          ],
        },
      ];
      expect(result).toEqual(expected);
    });

    it("Deberia parsear una sentencia con un operador de comparacion", () => {
      const tokens: Token[][] = [
        [
          { type: "keyword", value: "if", column: 0 },
          { type: "identifier", value: "x", column: 2 },
          { type: "operator", value: "<", column: 4 },
          { type: "number", value: "10", column: 7 },
        ],
        [
          { type: "keyword", value: "print", column: 2 },
          { type: "string", value: '"Es 10"', column: 8 },
        ],
      ];
      const result = AnalizadorSintactico(tokens);

      const expected: BodyStatement = [
        {
          type: "if_statement",
          condition: {
            type: "comparison_expression",
            operator: "<",
            left: {
              type: "identifier",
              value: "x",
              column: 2,
            },
            right: {
              type: "number",
              value: "10",
              column: 7,
            },
          },
          body: [
            {
              type: "print_statement",
              argument: {
                type: "string",
                value: '"Es 10"',
                column: 8,
              },
            },
          ],
        },
      ];
      expect(result).toEqual(expected);
    });

    it("Deberia parsear una sentencia con un boolean", () => {
      const tokens: Token[][] = [
        [
          { type: "keyword", value: "if", column: 0 },
          { type: "boolean", value: "true", column: 2 },
        ],
        [
          { type: "keyword", value: "print", column: 2 },
          { type: "string", value: '"Es 10"', column: 8 },
        ],
      ];
      const result = AnalizadorSintactico(tokens);

      const expected: BodyStatement = [
        {
          type: "if_statement",
          condition: {
            type: "boolean",
            value: "true",
            column: 2,
          },
          body: [
            {
              type: "print_statement",
              argument: {
                type: "string",
                value: '"Es 10"',
                column: 8,
              },
            },
          ],
        },
      ];
      expect(result).toEqual(expected);
    });
  });

  describe("Sentencias while", () => {
    it("Deberia parsear una sentencia while correctamente", () => {
      const tokens: Token[][] = [
        [
          { type: "keyword", value: "while", column: 0 },
          { type: "identifier", value: "x", column: 6 },
          { type: "operator", value: "<", column: 8 },
          { type: "number", value: "10", column: 10 },
          { type: "punctuation", value: ":", column: 13 },
        ],
        [
          { type: "keyword", value: "print", column: 2 },
          { type: "string", value: '"Es 10"', column: 8 },
        ],
      ];
      const result = AnalizadorSintactico(tokens);
      const expected: BodyStatement = [
        {
          type: "while_statement",
          condition: {
            type: "comparison_expression",
            operator: "<",
            left: {
              type: "identifier",
              value: "x",
              column: 6,
            },
            right: {
              type: "number",
              value: "10",
              column: 10,
            },
          },
          body: [
            {
              type: "print_statement",
              argument: {
                type: "string",
                value: '"Es 10"',
                column: 8,
              },
            },
          ],
        },
      ];
      expect(result).toEqual(expected);
    });
  });

  describe("Sentencias for", () => {
    it("Deberia parsear una sentencia for correctamente", () => {
      const tokens: Token[][] = [
        [
          { type: "keyword", value: "for", column: 0 },
          { type: "identifier", value: "i", column: 4 },
          { type: "operator", value: "=", column: 6 },
          { type: "number", value: "1", column: 8 },
          { type: "keyword", value: "to", column: 10 },
          { type: "number", value: "10", column: 13 },
          { type: "punctuation", value: ":", column: 16 },
        ],
        [
          { type: "keyword", value: "print", column: 2 },
          { type: "string", value: '"Iteracion"', column: 8 },
        ],
      ];
      const result = AnalizadorSintactico(tokens);
      const expected: BodyStatement = [
        {
          type: "for_statement",
          iterator: {
            type: "new_variable_declaration",
            variable: {
              column: 4,
              type: "identifier",
              value: "i",
            },
          },
          init: {
            type: "number",
            value: "1",
            column: 8,
          },
          end: {
            type: "number",
            value: "10",
            column: 13,
          },
          body: [
            {
              type: "print_statement",
              argument: {
                type: "string",
                value: '"Iteracion"',
                column: 8,
              },
            },
          ],
        },
      ];
      expect(result).toEqual(expected);
    });

    it("Deberia parsear una sentencia for con step", () => {
      const tokens: Token[][] = [
        [
          { type: "keyword", value: "for", column: 0 },
          { type: "identifier", value: "i", column: 4 },
          { type: "operator", value: "=", column: 6 },
          { type: "number", value: "1", column: 8 },
          { type: "keyword", value: "to", column: 10 },
          { type: "number", value: "10", column: 13 },
          { type: "keyword", value: "step", column: 16 },
          { type: "number", value: "2", column: 21 },
          { type: "punctuation", value: ":", column: 23 },
        ],
        [
          { type: "keyword", value: "print", column: 2 },
          { type: "string", value: '"Iteracion"', column: 8 },
        ],
      ];
      const result = AnalizadorSintactico(tokens);
      const expected: BodyStatement = [
        {
          type: "for_statement",
          iterator: {
            type: "new_variable_declaration",
            variable: {
              column: 4,
              type: "identifier",
              value: "i",
            },
          },
          init: {
            type: "number",
            value: "1",
            column: 8,
          },
          end: {
            type: "number",
            value: "10",
            column: 13,
          },
          step: {
            type: "number",
            value: "2",
            column: 21,
          },
          body: [
            {
              type: "print_statement",
              argument: {
                type: "string",
                value: '"Iteracion"',
                column: 8,
              },
            },
          ],
        },
      ];
      expect(result).toEqual(expected);
    });
  });
});
