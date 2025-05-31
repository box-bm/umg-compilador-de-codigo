import AnalizadorSemantico from "./AnalizadorSemantico";
import type {
  BodyStatement,
  ComparisonExpression,
  ErrorDefinition,
} from "../types/AST";

describe("AnalizadorSemantico", () => {
  describe("Variables", () => {
    it("Debería detectar uso de variable no declarada", () => {
      const ast: BodyStatement = [
        {
          type: "binary_expression",
          operator: "+",
          left: { type: "identifier", value: "x", column: 0 },
          right: { type: "number", value: "10", column: 4 },
        },
      ];
      const error: ErrorDefinition = {
        type: "SemanticError",
        message: "Variable 'x' no declarada",
        column: 0,
        line: 1,
      };
      expect(AnalizadorSemantico(ast)).toEqual(error);
    });

    it("Debería detectar redeclaración de variable", () => {
      const ast: BodyStatement = [
        {
          type: "new_variable_declaration",
          variable: { type: "identifier", value: "x", column: 4 },
        },
        {
          type: "new_variable_declaration",
          variable: { type: "identifier", value: "x", column: 8 },
        },
      ];
      const error: ErrorDefinition = {
        type: "SemanticError",
        message: "Variable 'x' redeclarada",
        column: 8,
        line: 2,
      };
      expect(AnalizadorSemantico(ast)).toEqual(error);
    });

    it("Debería permitir declaración y uso correcto de variable", () => {
      const ast: BodyStatement = [
        {
          type: "new_variable_declaration",
          variable: { type: "identifier", value: "x", column: 4 },
        },
        {
          type: "binary_expression",
          operator: "+",
          left: { type: "identifier", value: "x", column: 0 },
          right: { type: "number", value: "10", column: 4 },
        },
      ];
      expect(AnalizadorSemantico(ast)).toEqual(true);
    });

    it("Deberia permitir crear y asignar una variable constante", () => {
      const ast: BodyStatement = [
        {
          type: "constant_variable_declaration",
          variable: { type: "identifier", value: "x", column: 4 },
          value: { type: "number", value: "10", column: 8 },
        },
      ];
      expect(AnalizadorSemantico(ast)).toEqual(true);
    });

    it("Debería detectar asignación a constante", () => {
      const ast: BodyStatement = [
        {
          type: "constant_variable_declaration",
          variable: { type: "identifier", value: "x", column: 4 },
          value: { type: "number", value: "10", column: 8 },
        },
        {
          type: "assignment",
          variable: { type: "identifier", value: "x", column: 4 },
          value: { type: "number", value: "20", column: 8 },
        },
      ];
      const error: ErrorDefinition = {
        type: "SemanticError",
        message: "No se puede reasignar una constante",
        column: 4,
        line: 2,
      };
      expect(AnalizadorSemantico(ast)).toEqual(error);
    });

    it("Deberia permitir declarar una variable y luego asignarle un valor", () => {
      const ast: BodyStatement = [
        {
          type: "new_variable_declaration",
          variable: { type: "identifier", value: "x", column: 4 },
        },
        {
          type: "assignment",
          variable: { type: "identifier", value: "x", column: 4 },
          value: { type: "number", value: "10", column: 8 },
        },
      ];
      expect(AnalizadorSemantico(ast)).toEqual(true);
    });

    it("Deberia detectar si se asigna una variable no declarada", () => {
      const ast: BodyStatement = [
        {
          type: "assignment",
          variable: { type: "identifier", value: "x", column: 4 },
          value: { type: "number", value: "10", column: 8 },
        },
      ];

      const error: ErrorDefinition = {
        type: "SemanticError",
        message: "Variable 'x' no declarada",
        column: 4,
        line: 1,
      };

      expect(AnalizadorSemantico(ast)).toEqual(error);
    });
  });

  describe("Operadores Aritmeticos", () => {
    it("Deberia permitir concatenacion de textos y numeros", () => {
      const ast: BodyStatement = [
        {
          type: "binary_expression",
          operator: "+",
          left: {
            type: "binary_expression",
            operator: "+",
            left: { type: "string", value: '"Hola"', column: 0 },
            right: { type: "number", value: "10", column: 7 },
          },
          right: { type: "string", value: '" Mundo"', column: 10 },
        },
      ];
      expect(AnalizadorSemantico(ast)).toEqual(true);
    });

    it("Debería detectar operación entre tipos incompatibles", () => {
      const ast: BodyStatement = [
        {
          type: "binary_expression",
          operator: "+",
          left: { type: "number", value: "10", column: 0 },
          right: { type: "boolean", value: "true", column: 4 },
        },
      ];
      const error: ErrorDefinition = {
        type: "SemanticError",
        message: "No se puede operar entre tipos 'number' y 'boolean'",
        column: 4,
        line: 1,
      };
      expect(AnalizadorSemantico(ast)).toEqual(error);
    });

    it("Debería permitir operación entre tipos numericos compatibles", () => {
      const ast: BodyStatement = [
        {
          type: "binary_expression",
          operator: "+",
          left: { type: "number", value: "10", column: 0 },
          right: { type: "number", value: "20", column: 4 },
        },
      ];
      expect(AnalizadorSemantico(ast)).toEqual(true);
    });

    it("Deberia permitir operaciones con cadenas", () => {
      const ast: BodyStatement = [
        {
          type: "binary_expression",
          operator: "+",
          left: { type: "string", value: '"Hola"', column: 0 },
          right: { type: "string", value: '" Mundo"', column: 7 },
        },
      ];
      expect(AnalizadorSemantico(ast)).toEqual(true);
    });

    it.each(["-", "*", "/", "%"])(
      "Debería detectar operación no permitida entre cadenas con operador '%s'",
      (operador) => {
        const ast: BodyStatement = [
          {
            type: "binary_expression",
            operator: operador,
            left: { type: "string", value: '"Hola"', column: 0 },
            right: { type: "string", value: '" Mundo"', column: 7 },
          },
        ];
        const error: ErrorDefinition = {
          type: "SemanticError",
          message:
            "No se puede operar entre tipos 'string' y 'string' con el operador '-'",
          column: 7,
          line: 1,
        };
        expect(AnalizadorSemantico(ast)).toEqual(error);
      }
    );
  });

  describe("Operadores de comparación", () => {
    it("Debería detectar comparación entre tipos incompatibles", () => {
      const ast: BodyStatement = [
        {
          type: "comparison_expression",
          operator: "<",
          left: { type: "number", value: "10", column: 0 },
          right: { type: "string", value: '"Hola"', column: 4 },
        },
      ];
      const error: ErrorDefinition = {
        type: "SemanticError",
        message: "No se puede comparar 'number' con 'string'",
        column: 4,
        line: 1,
      };
      expect(AnalizadorSemantico(ast)).toEqual(error);
    });

    it.each([
      "<",
      "<=",
      ">",
      ">=",
      "==",
      "!=",
    ] as ComparisonExpression["operator"][])(
      "Debería permitir comparación entre números con operador '%s'",
      (operador) => {
        const ast: BodyStatement = [
          {
            type: "comparison_expression",
            operator: operador,
            left: { type: "number", value: "10", column: 0 },
            right: { type: "number", value: "20", column: 4 },
          },
        ];
        expect(AnalizadorSemantico(ast)).toEqual(true);
      }
    );

    it("Debería permitir comparación entre booleanos", () => {
      const ast: BodyStatement = [
        {
          type: "comparison_expression",
          operator: "==",
          left: { type: "boolean", value: "true", column: 0 },
          right: { type: "boolean", value: "false", column: 5 },
        },
      ];
      expect(AnalizadorSemantico(ast)).toEqual(true);
    });

    it("Deberia permitir comparación entre cadenas", () => {
      const ast: BodyStatement = [
        {
          type: "comparison_expression",
          operator: "==",
          left: { type: "string", value: '"Hola"', column: 0 },
          right: { type: "string", value: '"Hola"', column: 7 },
        },
      ];
      expect(AnalizadorSemantico(ast)).toEqual(true);
    });

    it("Debería detectar comparación entre cadena y número", () => {
      const ast: BodyStatement = [
        {
          type: "comparison_expression",
          operator: "<",
          left: { type: "string", value: '"Hola"', column: 0 },
          right: { type: "number", value: "10", column: 7 },
        },
      ];
      const error: ErrorDefinition = {
        type: "SemanticError",
        message: "No se puede comparar 'string' con 'number'",
        column: 7,
        line: 1,
      };
      expect(AnalizadorSemantico(ast)).toEqual(error);
    });

    it("Deberia permitir comparaciones entre identificadores", () => {
      const ast: BodyStatement = [
        {
          type: "new_variable_declaration_assignment",
          variable: { type: "identifier", value: "x", column: 0 },
          value: { type: "number", value: "10", column: 2 },
        },
        {
          type: "new_variable_declaration_assignment",
          variable: { type: "identifier", value: "y", column: 4 },
          value: { type: "number", value: "20", column: 6 },
        },
        {
          type: "comparison_expression",
          operator: "<",
          left: { type: "identifier", value: "x", column: 0 },
          right: { type: "identifier", value: "y", column: 4 },
        },
      ];
      expect(AnalizadorSemantico(ast)).toEqual(true);
    });

    it("Deberia detectar comparación entre identificador no declarado y número", () => {
      const ast: BodyStatement = [
        {
          type: "comparison_expression",
          operator: "<",
          left: { type: "identifier", value: "x", column: 0 },
          right: { type: "number", value: "10", column: 2 },
        },
      ];
      const error: ErrorDefinition = {
        type: "SemanticError",
        message: "Variable 'x' no declarada",
        column: 0,
        line: 1,
      };
      expect(AnalizadorSemantico(ast)).toEqual(error);
    });
  });

  describe("Operadores lógicos", () => {
    it("Debería detectar operación lógica con tipos no booleanos", () => {
      const ast: BodyStatement = [
        {
          type: "logical_operation",
          operator: "&&",
          left: { type: "number", value: "10", column: 0 },
          right: { type: "boolean", value: "true", column: 4 },
        },
      ];
      const error: ErrorDefinition = {
        type: "SemanticError",
        message: "No se puede operar entre tipos 'number' y 'boolean'",
        column: 4,
        line: 1,
      };
      expect(AnalizadorSemantico(ast)).toEqual(error);
    });

    it("Debería permitir operación lógica entre booleanos", () => {
      const ast: BodyStatement = [
        {
          type: "logical_operation",
          operator: "&&",
          left: { type: "boolean", value: "true", column: 0 },
          right: { type: "boolean", value: "false", column: 5 },
        },
      ];
      expect(AnalizadorSemantico(ast)).toEqual(true);
    });

    it("Debería permitir operación lógica con identificadores booleanos", () => {
      const ast: BodyStatement = [
        {
          type: "new_variable_declaration_assignment",
          variable: { type: "identifier", value: "x", column: 0 },
          value: { type: "boolean", value: "true", column: 2 },
        },
        {
          type: "logical_operation",
          operator: "||",
          left: { type: "identifier", value: "x", column: 0 },
          right: { type: "boolean", value: "false", column: 2 },
        },
      ];
      expect(AnalizadorSemantico(ast)).toEqual(true);
    });

    it("Debería detectar operación lógica con tipos no booleanos", () => {
      const ast: BodyStatement = [
        {
          type: "logical_operation",
          operator: "||",
          left: { type: "string", value: '"Hola"', column: 0 },
          right: { type: "boolean", value: "true", column: 7 },
        },
      ];
      const error: ErrorDefinition = {
        type: "SemanticError",
        message: "No se puede operar entre tipos 'string' y 'boolean'",
        column: 7,
        line: 1,
      };
      expect(AnalizadorSemantico(ast)).toEqual(error);
    });

    it("Debería permitir operación lógica con booleanos y comparaciones", () => {
      const ast: BodyStatement = [
        {
          type: "logical_operation",
          operator: "&&",
          left: {
            type: "comparison_expression",
            operator: "<",
            left: { type: "number", value: "10", column: 0 },
            right: { type: "number", value: "20", column: 4 },
          },
          right: { type: "boolean", value: "true", column: 8 },
        },
      ];
      expect(AnalizadorSemantico(ast)).toEqual(true);
    });
  });

  describe("Sentencias if", () => {
    it("Debería detectar condición no booleana en if", () => {
      const ast: BodyStatement = [
        {
          type: "if_statement",
          condition: { type: "number", value: "10", column: 2 },
          body: [],
        },
      ];
      const error: ErrorDefinition = {
        type: "SemanticError",
        message: "La condición de if debe ser booleana",
        column: 2,
        line: 1,
      };
      expect(AnalizadorSemantico(ast)).toEqual(error);
    });

    it("Debería permitir condición booleana en if", () => {
      const ast: BodyStatement = [
        {
          type: "if_statement",
          condition: { type: "boolean", value: "true", column: 2 },
          body: [],
        },
      ];
      expect(AnalizadorSemantico(ast)).toEqual(true);
    });

    it("deberia detectar variables no declaradas en la condición del if", () => {
      const ast: BodyStatement = [
        {
          type: "if_statement",
          condition: { type: "identifier", value: "x", column: 2 },
          body: [],
        },
      ];
      const error: ErrorDefinition = {
        type: "SemanticError",
        message: "Variable 'x' no declarada",
        column: 2,
        line: 1,
      };
      expect(AnalizadorSemantico(ast)).toEqual(error);
    });

    it("deberia deetectar variables no asignada en la comparación del if", () => {
      const ast: BodyStatement = [
        {
          type: "new_variable_declaration_assignment",
          variable: { type: "identifier", value: "x", column: 0 },
          value: { type: "number", value: "5", column: 2 },
        },
        {
          type: "new_variable_declaration",
          variable: { type: "identifier", value: "y", column: 4 },
        },
        {
          type: "if_statement",
          condition: {
            type: "comparison_expression",
            operator: "<",
            left: { type: "identifier", value: "x", column: 0 },
            right: { type: "identifier", value: "y", column: 4 },
          },
          body: [],
        },
      ];

      const error: ErrorDefinition = {
        type: "SemanticError",
        message: "Variable 'y' no declarada",
        column: 4,
        line: 3,
      };
      expect(AnalizadorSemantico(ast)).toEqual(error);
    });
  });

  describe("Sentencias while", () => {
    it("Debería detectar condición no booleana en while", () => {
      const ast: BodyStatement = [
        {
          type: "while_statement",
          condition: {
            type: "comparison_expression",
            operator: "<",
            left: { type: "number", value: "10", column: 0 },
            right: { type: "string", value: '"Hola"', column: 4 },
          },
          body: [
            {
              type: "print_statement",
              argument: { type: "string", value: '"Hola"', column: 2 },
            },
            {
              type: "assignment",
              variable: { type: "identifier", value: "x", column: 2 },
              value: { type: "number", value: "10", column: 4 },
            },
          ],
        },
      ];
      const error: ErrorDefinition = {
        type: "SemanticError",
        message: "No se puede comparar 'number' con 'string'",
        column: 4,
        line: 1,
      };
      expect(AnalizadorSemantico(ast)).toEqual(error);
    });

    it("Deberia permitir condición de comparación en while", () => {
      const ast: BodyStatement = [
        {
          type: "while_statement",
          condition: {
            type: "comparison_expression",
            operator: "<",
            left: { type: "number", value: "10", column: 0 },
            right: { type: "number", value: "20", column: 4 },
          },
          body: [],
        },
      ];
      expect(AnalizadorSemantico(ast)).toEqual(true);
    });

    it("Deberia permitir condición de operación lógica en while", () => {
      const ast: BodyStatement = [
        {
          type: "while_statement",
          condition: {
            type: "logical_operation",
            operator: "&&",
            left: { type: "boolean", value: "true", column: 0 },
            right: { type: "boolean", value: "false", column: 5 },
          },
          body: [],
        },
      ];
      expect(AnalizadorSemantico(ast)).toEqual(true);
    });

    it("Deberia permitir condición de booleano en while", () => {
      const ast: BodyStatement = [
        {
          type: "while_statement",
          condition: { type: "boolean", value: "false", column: 0 },
          body: [],
        },
      ];
      expect(AnalizadorSemantico(ast)).toEqual(true);
    });

    it("Deberia permitir identificador como condición en while", () => {
      const ast: BodyStatement = [
        {
          type: "new_variable_declaration_assignment",
          variable: { type: "identifier", value: "x", column: 0 },
          value: { type: "boolean", value: "true", column: 2 },
        },
        {
          type: "while_statement",
          condition: { type: "identifier", value: "x", column: 0 },
          body: [],
        },
      ];
      expect(AnalizadorSemantico(ast)).toEqual(true);
    });

    it("Debería permitir condición booleana en while", () => {
      const ast: BodyStatement = [
        {
          type: "while_statement",
          condition: { type: "boolean", value: "true", column: 0 },
          body: [],
        },
      ];
      expect(AnalizadorSemantico(ast)).toEqual(true);
    });

    it("Deberia detectar que la condicion del while no puede ser un numero", () => {
      const ast: BodyStatement = [
        {
          type: "while_statement",
          condition: { type: "number", value: "10", column: 0 },
          body: [],
        },
      ];
      const error: ErrorDefinition = {
        type: "SemanticError",
        message: "La condición de while debe ser booleana",
        column: 0,
        line: 1,
      };
      expect(AnalizadorSemantico(ast)).toEqual(error);
    });

    it("Deberia detectar la condicion puede ser un operador logico", () => {
      const ast: BodyStatement = [
        {
          type: "while_statement",
          condition: {
            type: "logical_operation",
            operator: "&&",
            left: { type: "boolean", value: "true", column: 0 },
            right: { type: "boolean", value: "false", column: 5 },
          },
          body: [],
        },
      ];
      expect(AnalizadorSemantico(ast)).toEqual(true);
    });

    it("Deberia detectar que la condicion puede ser un comparador", () => {
      const ast: BodyStatement = [
        {
          type: "while_statement",
          condition: {
            type: "comparison_expression",
            operator: "<",
            left: { type: "number", value: "10", column: 0 },
            right: { type: "number", value: "20", column: 4 },
          },
          body: [],
        },
      ];
      expect(AnalizadorSemantico(ast)).toEqual(true);
    });
  });

  describe("Print", () => {
    it("Debería permitir imprimir cualquier tipo válido", () => {
      const ast: BodyStatement = [
        {
          type: "print_statement",
          argument: { type: "string", value: '"hola"', column: 2 },
        },
        {
          type: "print_statement",
          argument: { type: "number", value: "10", column: 2 },
        },
        {
          type: "print_statement",
          argument: { type: "boolean", value: "true", column: 2 },
        },
      ];
      expect(AnalizadorSemantico(ast)).toEqual(true);
    });

    it("Debería detectar impresión de variable no declarada", () => {
      const ast: BodyStatement = [
        {
          type: "print_statement",
          argument: { type: "identifier", value: "x", column: 2 },
        },
      ];
      const error: ErrorDefinition = {
        type: "SemanticError",
        message: "Variable 'x' no declarada",
        column: 2,
        line: 1,
      };
      expect(AnalizadorSemantico(ast)).toEqual(error);
    });
  });

  describe("Sentencia for", () => {
    it("Debería permitir un for con declaración y uso correcto del iterador", () => {
      const ast: BodyStatement = [
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
      expect(AnalizadorSemantico(ast)).toEqual(true);
    });

    it("Debería permitir un for con step", () => {
      const ast: BodyStatement = [
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
      expect(AnalizadorSemantico(ast)).toEqual(true);
    });

    it("Debería detectar uso de variable no declarada dentro del for", () => {
      const ast: BodyStatement = [
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
              type: "binary_expression",
              operator: "+",
              left: { type: "identifier", value: "x", column: 2 },
              right: { type: "number", value: "1", column: 4 },
            },
          ],
        },
      ];
      const error: ErrorDefinition = {
        type: "SemanticError",
        message: "Variable 'x' no declarada",
        column: 2,
        line: 2,
      };
      expect(AnalizadorSemantico(ast)).toEqual(error);
    });

    it("Debería detectar redeclaración del iterador dentro del for", () => {
      const ast: BodyStatement = [
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
              type: "new_variable_declaration",
              variable: { type: "identifier", value: "i", column: 6 },
            },
          ],
        },
      ];
      const error: ErrorDefinition = {
        type: "SemanticError",
        message: "Variable 'i' redeclarada",
        column: 6,
        line: 2,
      };
      expect(AnalizadorSemantico(ast)).toEqual(error);
    });

    it("Debería detectar que el iterador no puede ser reasignado dentro del for", () => {
      const ast: BodyStatement = [
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
              type: "assignment",
              variable: { type: "identifier", value: "i", column: 6 },
              value: { type: "number", value: "5", column: 8 },
            },
          ],
        },
      ];
      const error: ErrorDefinition = {
        type: "SemanticError",
        message: "No se puede reasignar el iterador del for",
        column: 6,
        line: 2,
      };
      expect(AnalizadorSemantico(ast)).toEqual(error);
    });

    it("Debería detectar que el inicio, fin y step del for deben ser numéricos", () => {
      const ast: BodyStatement = [
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
            type: "string",
            value: '"uno"',
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
          body: [],
        },
      ];
      const error: ErrorDefinition = {
        type: "SemanticError",
        message: "El inicio, fin y step del for deben ser numéricos",
        column: 8,
        line: 1,
      };
      expect(AnalizadorSemantico(ast)).toEqual(error);
    });

    it("Debería detectar que el step del for debe ser numérico", () => {
      const ast: BodyStatement = [
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
            type: "string",
            value: '"dos"',
            column: 21,
          },
          body: [],
        },
      ];
      const error: ErrorDefinition = {
        type: "SemanticError",
        message: "El step del for debe ser un número",
        column: 21,
        line: 1,
      };
      expect(AnalizadorSemantico(ast)).toEqual(error);
    });

    it("Deberia detectar que el iterador del for ya ha sido declarado", () => {
      const ast: BodyStatement = [
        {
          type: "new_variable_declaration",
          variable: { type: "identifier", value: "i", column: 4 },
        },
        {
          type: "for_statement",
          iterator: {
            type: "new_variable_declaration",
            variable: { type: "identifier", value: "i", column: 8 },
          },
          init: {
            type: "number",
            value: "1",
            column: 12,
          },
          end: {
            type: "number",
            value: "10",
            column: 17,
          },
          body: [],
        },
      ];
      const error: ErrorDefinition = {
        type: "SemanticError",
        message: "Variable 'i' ya declarada anteriormente",
        column: 8,
        line: 2,
      };
      expect(AnalizadorSemantico(ast)).toEqual(error);
    });
  });

  describe("Codigo real", () => {
    it("Deberia permitir el caso de uso real de operaciones aritmeticas", () => {
      const ast: BodyStatement = [
        {
          type: "new_variable_declaration_assignment",
          variable: { type: "identifier", value: "x", column: 0 },
          value: { type: "number", value: "10", column: 2 },
        },
        {
          type: "new_variable_declaration_assignment",
          variable: { type: "identifier", value: "y", column: 4 },
          value: { type: "number", value: "20", column: 6 },
        },
        {
          type: "print_statement",
          argument: {
            type: "binary_expression",
            operator: "+",
            left: { type: "identifier", value: "x", column: 2 },
            right: { type: "identifier", value: "y", column: 6 },
          },
        },
      ];
      expect(AnalizadorSemantico(ast)).toEqual(true);
    });

    it("Deberia permitir el caso de uso real de operacion logica AND", () => {
      const ast: BodyStatement = [
        {
          type: "new_variable_declaration_assignment",
          variable: { type: "identifier", value: "x", column: 0 },
          value: { type: "boolean", value: "true", column: 2 },
        },
        {
          type: "new_variable_declaration_assignment",
          variable: { type: "identifier", value: "y", column: 4 },
          value: { type: "boolean", value: "false", column: 6 },
        },
        {
          type: "print_statement",
          argument: {
            type: "logical_operation",
            operator: "&&",
            left: { type: "identifier", value: "x", column: 2 },
            right: { type: "identifier", value: "y", column: 6 },
          },
        },
      ];
      expect(AnalizadorSemantico(ast)).toEqual(true);
    });

    it("Deberia permitir el caso de uso real de operacion logica OR", () => {
      const ast: BodyStatement = [
        {
          type: "new_variable_declaration_assignment",
          variable: { type: "identifier", value: "x", column: 0 },
          value: { type: "boolean", value: "true", column: 2 },
        },
        {
          type: "new_variable_declaration_assignment",
          variable: { type: "identifier", value: "y", column: 4 },
          value: { type: "boolean", value: "false", column: 6 },
        },
        {
          type: "print_statement",
          argument: {
            type: "logical_operation",
            operator: "||",
            left: { type: "identifier", value: "x", column: 2 },
            right: { type: "identifier", value: "y", column: 6 },
          },
        },
      ];
      expect(AnalizadorSemantico(ast)).toEqual(true);
    });

    it("Deberia permitir el caso de uso real de una negacion", () => {
      const ast: BodyStatement = [
        {
          type: "new_variable_declaration_assignment",
          variable: { type: "identifier", value: "x", column: 0 },
          value: { type: "boolean", value: "true", column: 2 },
        },
        {
          type: "print_statement",
          argument: {
            type: "logical_operation",
            operator: "!",
            left: { type: "identifier", value: "x", column: 2 },
          },
        },
      ];
      expect(AnalizadorSemantico(ast)).toEqual(true);
    });

    it("Deberia permitir el caso de uso real de una condicion con comparadores y operaciones logicas", () => {
      const ast: BodyStatement = [
        {
          type: "new_variable_declaration_assignment",
          variable: { type: "identifier", value: "x", column: 0 },
          value: { type: "number", value: "10", column: 2 },
        },
        {
          type: "if_statement",
          condition: {
            type: "logical_operation",
            operator: "&&",
            left: {
              type: "comparison_expression",
              operator: "<",
              left: { type: "identifier", value: "x", column: 0 },
              right: { type: "number", value: "20", column: 4 },
            },
            right: {
              type: "comparison_expression",
              operator: ">",
              left: { type: "identifier", value: "x", column: 0 },
              right: { type: "number", value: "5", column: 8 },
            },
          },
          body: [
            {
              type: "print_statement",
              argument: {
                type: "string",
                value: '"x es mayor que 5 y menor que 20"',
                column: 2,
              },
            },
          ],
        },
        {
          type: "print_statement",
          argument: { type: "identifier", value: "x", column: 2 },
        },
      ];
      expect(AnalizadorSemantico(ast)).toEqual(true);
    });

    it("Deberia permitir el caso de uso real de una condicion con comparadores y operaciones logicas anidadas", () => {
      const ast: BodyStatement = [
        {
          type: "new_variable_declaration_assignment",
          variable: { type: "identifier", value: "x", column: 0 },
          value: { type: "number", value: "10", column: 2 },
        },
        {
          type: "if_statement",
          condition: {
            type: "logical_operation",
            operator: "&&",
            left: {
              type: "comparison_expression",
              operator: "<",
              left: { type: "identifier", value: "x", column: 0 },
              right: { type: "number", value: "5", column: 4 },
            },
            right: {
              type: "logical_operation",
              operator: "||",
              left: {
                type: "comparison_expression",
                operator: ">",
                left: { type: "identifier", value: "x", column: 0 },
                right: { type: "number", value: "15", column: 8 },
              },
              right: {
                type: "comparison_expression",
                operator: "==",
                left: { type: "identifier", value: "x", column: 0 },
                right: { type: "number", value: "10", column: 12 },
              },
            },
          },
          body: [
            {
              type: "print_statement",
              argument: {
                type: "string",
                value: '"x es menor que 5 o mayor que 15 o igual a 10"',
                column: 2,
              },
            },
          ],
        },
      ];
      expect(AnalizadorSemantico(ast)).toEqual(true);
    });

    it("Deberia permitir el caso de uso real de if", () => {
      const ast: BodyStatement = [
        {
          type: "new_variable_declaration_assignment",
          variable: { type: "identifier", value: "x", column: 0 },
          value: { type: "number", value: "10", column: 2 },
        },
        {
          type: "if_statement",
          condition: {
            type: "comparison_expression",
            operator: "<",
            left: { type: "identifier", value: "x", column: 0 },
            right: { type: "number", value: "20", column: 4 },
          },
          body: [
            {
              type: "print_statement",
              argument: {
                type: "string",
                value: '"x es menor que 20"',
                column: 2,
              },
            },
          ],
          elseIf: {
            type: "if_statement",
            condition: {
              type: "comparison_expression",
              operator: ">",
              left: { type: "identifier", value: "x", column: 0 },
              right: { type: "number", value: "20", column: 4 },
            },
            body: [
              {
                type: "print_statement",
                argument: {
                  type: "string",
                  value: '"x es mayor que 20"',
                  column: 2,
                },
              },
            ],
          },
          elseBody: [
            {
              type: "print_statement",
              argument: {
                type: "string",
                value: '"x es igual a 20"',
                column: 2,
              },
            },
          ],
        },
        {
          type: "print_statement",
          argument: { type: "identifier", value: "x", column: 2 },
        },
      ];
      expect(AnalizadorSemantico(ast)).toEqual(true);
    });

    it("Deberia permitir el caso de uso real if aniadado", () => {
      const ast: BodyStatement = [
        {
          type: "new_variable_declaration_assignment",
          variable: { type: "identifier", value: "x", column: 0 },
          value: { type: "number", value: "10", column: 2 },
        },
        {
          type: "if_statement",
          condition: {
            type: "comparison_expression",
            operator: "<",
            left: { type: "identifier", value: "x", column: 0 },
            right: { type: "number", value: "20", column: 4 },
          },
          body: [
            {
              type: "if_statement",
              condition: {
                type: "comparison_expression",
                operator: "<",
                left: { type: "identifier", value: "x", column: 0 },
                right: { type: "number", value: "15", column: 6 },
              },
              body: [
                {
                  type: "print_statement",
                  argument: {
                    type: "string",
                    value: '"x es menor que 15"',
                    column: 2,
                  },
                },
              ],
            },
          ],
        },
      ];
      expect(AnalizadorSemantico(ast)).toEqual(true);
    });

    it("Debería permitir caso de uso real de while", () => {
      const ast: BodyStatement = [
        {
          type: "new_variable_declaration_assignment",
          variable: { type: "identifier", value: "x", column: 0 },
          value: { type: "number", value: "10", column: 2 },
        },
        {
          type: "while_statement",
          condition: {
            type: "comparison_expression",
            operator: "<",
            left: { type: "identifier", value: "x", column: 0 },
            right: { type: "number", value: "10", column: 4 },
          },
          body: [
            {
              type: "assignment",
              variable: { type: "identifier", value: "x", column: 2 },
              value: {
                type: "binary_expression",
                operator: "+",
                left: { type: "identifier", value: "x", column: 4 },
                right: { type: "number", value: "1", column: 6 },
              },
            },
            {
              type: "print_statement",
              argument: { type: "identifier", value: "x", column: 2 },
            },
          ],
        },
      ];
      expect(AnalizadorSemantico(ast)).toEqual(true);
    });

    it("Deberia permitir caso de uso ciclo for", () => {
      const ast: BodyStatement = [
        {
          type: "new_variable_declaration_assignment",
          variable: { type: "identifier", value: "saludo", column: 0 },
          value: { type: "string", value: '"Hola"', column: 2 },
        },
        {
          type: "for_statement",
          iterator: {
            type: "new_variable_declaration",
            variable: { type: "identifier", value: "i", column: 4 },
          },
          init: { type: "number", value: "0", column: 8 },
          end: { type: "number", value: "5", column: 11 },
          body: [
            {
              type: "print_statement",
              argument: { type: "identifier", value: "saludo", column: 2 },
            },
          ],
        },
      ];
      expect(AnalizadorSemantico(ast)).toEqual(true);
    });

    it("Deberia detectar variables no declaradas en el caso de uso real", () => {
      const ast: BodyStatement = [
        {
          type: "new_variable_declaration_assignment",
          variable: { type: "identifier", value: "x", column: 0 },
          value: { type: "number", value: "10", column: 2 },
        },
        {
          type: "print_statement",
          argument: { type: "identifier", value: "y", column: 2 },
        },
      ];
      const error: ErrorDefinition = {
        type: "SemanticError",
        message: "Variable 'y' no declarada",
        column: 2,
        line: 2,
      };
      expect(AnalizadorSemantico(ast)).toEqual(error);
    });

    it("Deberia detectar variables no declaradas en el caso de uso real con operaciones aritmeticas", () => {
      const ast: BodyStatement = [
        {
          type: "new_variable_declaration_assignment",
          variable: { type: "identifier", value: "x", column: 0 },
          value: { type: "number", value: "10", column: 2 },
        },
        {
          type: "print_statement",
          argument: {
            type: "binary_expression",
            operator: "+",
            left: { type: "identifier", value: "x", column: 2 },
            right: { type: "identifier", value: "y", column: 4 },
          },
        },
      ];
      const error: ErrorDefinition = {
        type: "SemanticError",
        message: "Variable 'y' no declarada",
        column: 4,
        line: 2,
      };
      expect(AnalizadorSemantico(ast)).toEqual(error);
    });

    it("Deberia detectar constante asignada con variables binarias", () => {
      const ast: BodyStatement = [
        {
          type: "constant_variable_declaration",
          variable: { type: "identifier", value: "PI", column: 0 },
          value: {
            type: "binary_expression",
            operator: "+",
            left: { type: "number", value: "3.14", column: 2 },
            right: { type: "number", value: "z", column: 7 },
          }
        },
      ];
      const error: ErrorDefinition = {
        type: "SemanticError",
        message: "Variable 'z' no declarada",
        column: 7,
        line: 1,
      };
      expect(AnalizadorSemantico(ast)).toEqual(error);
    });
  });
});
