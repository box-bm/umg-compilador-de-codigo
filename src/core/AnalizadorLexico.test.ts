import AnalizadorLexico from "./AnalizadorLexico";
import type Token from "../types/Token";

describe("AnalizadorLexico", () => {
  describe("líneas vacías", () => {
    it("debería manejar líneas vacías", () => {
      const line = "";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([] as Token[]);
    });
    it("debería manejar líneas vacías con espacios", () => {
      const line = "   ";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([] as Token[]);
    });
  });

  describe("tabulación", () => {
    it("debería manejar tabulación", () => {
      const line = "  let x = 10";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "let", column: 2 },
        { type: "identifier", value: "x", column: 6 },
        { type: "operator", value: "=", column: 8 },
        { type: "number", value: "10", column: 10 },
      ] as Token[]);
    });

    it("debería manejar múltiples tabulaciones", () => {
      const line = "        let x = 10";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "let", column: 4 },
        { type: "identifier", value: "x", column: 8 },
        { type: "operator", value: "=", column: 10 },
        { type: "number", value: "10", column: 12 },
      ] as Token[]);
    });
  });

  describe("Tipos de variables", () => {
    it("debería manejar números", () => {
      const line = "10";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "number", value: "10", column: 0 },
      ] as Token[]);
    });

    it("debería manejar cadenas", () => {
      const line = '"Hola"';
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "string", value: '"Hola"', column: 0 },
      ] as Token[]);
    });

    it("debería manejar booleanos", () => {
      const line = "true";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "boolean", value: "true", column: 0 },
      ] as Token[]);
    });

    it("debería manejar identificadores", () => {
      const line = "x";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "identifier", value: "x", column: 0 },
      ] as Token[]);
    });

    it("debería manejar palabras reservadas", () => {
      const line = "if";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "if", column: 0 },
      ] as Token[]);
    });
  });

  describe("declaraciones de variables", () => {
    it("deberia parsear una declaracion de variable", () => {
      const line = "let x";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "let", column: 0 },
        { type: "identifier", value: "x", column: 4 },
      ] as Token[]);
    });
    
    it("debería manejar declaraciones de variables", () => {
      const line = "let x = 10";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "let", column: 0 },
        { type: "identifier", value: "x", column: 4 },
        { type: "operator", value: "=", column: 6 },
        { type: "number", value: "10", column: 8 },
      ] as Token[]);
    });

    it("debería manejar declaraciones de constantes con cadenas", () => {
      const line = 'const y = "Hola"';
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "const", column: 0 },
        { type: "identifier", value: "y", column: 6 },
        { type: "operator", value: "=", column: 8 },
        { type: "string", value: '"Hola"', column: 10 },
      ] as Token[]);
    });

    it("debería asignar un valor a una variable int", () => {
      const line = "x = 20";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "identifier", value: "x", column: 0 },
        { type: "operator", value: "=", column: 2 },
        { type: "number", value: "20", column: 4 },
      ] as Token[]);
    });

    it("debería asignar un valor a una variable string", () => {
      const line = 'x = "Hola"';
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "identifier", value: "x", column: 0 },
        { type: "operator", value: "=", column: 2 },
        { type: "string", value: '"Hola"', column: 4 },
      ] as Token[]);
    });
  });

  describe("operadores aritméticos", () => {
    it("debería manejar operadores aritméticos", () => {
      const line = "x + y - z";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "identifier", value: "x", column: 0 },
        { type: "operator", value: "+", column: 2 },
        { type: "identifier", value: "y", column: 4 },
        { type: "operator", value: "-", column: 6 },
        { type: "identifier", value: "z", column: 8 },
      ] as Token[]);
    });

    it("debería manejar todos los operadores aritméticos", () => {
      const line = "x + y - z * 10 / 5 % 2";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "identifier", value: "x", column: 0 },
        { type: "operator", value: "+", column: 2 },
        { type: "identifier", value: "y", column: 4 },
        { type: "operator", value: "-", column: 6 },
        { type: "identifier", value: "z", column: 8 },
        { type: "operator", value: "*", column: 10 },
        { type: "number", value: "10", column: 12 },
        { type: "operator", value: "/", column: 15 },
        { type: "number", value: "5", column: 17 },
        { type: "operator", value: "%", column: 19 },
        { type: "number", value: "2", column: 21 },
      ] as Token[]);
    });

    it("debería manejar operadores aritméticos con números", () => {
      const line = "x + 10 - 20";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "identifier", value: "x", column: 0 },
        { type: "operator", value: "+", column: 2 },
        { type: "number", value: "10", column: 4 },
        { type: "operator", value: "-", column: 7 },
        { type: "number", value: "20", column: 9 },
      ] as Token[]);
    });

    it("debería manejar operadores aritméticos con cadenas y números", () => {
      const line = 'x + "Hola" - 20';
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "identifier", value: "x", column: 0 },
        { type: "operator", value: "+", column: 2 },
        { type: "string", value: '"Hola"', column: 4 },
        { type: "operator", value: "-", column: 11 },
        { type: "number", value: "20", column: 13 },
      ] as Token[]);
    });
  });

  describe("operadores lógicos", () => {
    it("debería manejar operadores lógicos", () => {
      const line = "x && y || z";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "identifier", value: "x", column: 0 },
        { type: "operator", value: "&&", column: 2 },
        { type: "identifier", value: "y", column: 5 },
        { type: "operator", value: "||", column: 7 },
        { type: "identifier", value: "z", column: 10 },
      ] as Token[]);
    });

    it("debería manejar operadores lógicos con números", () => {
      const line = "x && 10 || 20";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "identifier", value: "x", column: 0 },
        { type: "operator", value: "&&", column: 2 },
        { type: "number", value: "10", column: 5 },
        { type: "operator", value: "||", column: 8 },
        { type: "number", value: "20", column: 11 },
      ] as Token[]);
    });

    it("debería manejar operadores lógicos, número con cadenas", () => {
      const line = 'x && "Hola" || 20';
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "identifier", value: "x", column: 0 },
        { type: "operator", value: "&&", column: 2 },
        { type: "string", value: '"Hola"', column: 5 },
        { type: "operator", value: "||", column: 12 },
        { type: "number", value: "20", column: 15 },
      ] as Token[]);
    });

    it("debería negar una variable", () => {
      const line = "!x";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "operator", value: "!", column: 0 },
        { type: "identifier", value: "x", column: 1 },
      ] as Token[]);
    });
  });

  describe("operadores de comparación", () => {
    it("debería manejar operadores de comparación", () => {
      const line = "x == y != z";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "identifier", value: "x", column: 0 },
        { type: "operator", value: "==", column: 2 },
        { type: "identifier", value: "y", column: 5 },
        { type: "operator", value: "!=", column: 7 },
        { type: "identifier", value: "z", column: 10 },
      ] as Token[]);
    });

    it("debería manejar operadores de comparación con números", () => {
      const line = "x == 10 != 20";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "identifier", value: "x", column: 0 },
        { type: "operator", value: "==", column: 2 },
        { type: "number", value: "10", column: 5 },
        { type: "operator", value: "!=", column: 8 },
        { type: "number", value: "20", column: 11 },
      ] as Token[]);
    });

    it("debería manejar operadores de comparación con cadenas y números", () => {
      const line = 'x == "Hola" != 20';
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "identifier", value: "x", column: 0 },
        { type: "operator", value: "==", column: 2 },
        { type: "string", value: '"Hola"', column: 5 },
        { type: "operator", value: "!=", column: 12 },
        { type: "number", value: "20", column: 15 },
      ] as Token[]);
    });

    it("debería manejar mayor que y menor que", () => {
      const line = "x > 10 < 20";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "identifier", value: "x", column: 0 },
        { type: "operator", value: ">", column: 2 },
        { type: "number", value: "10", column: 4 },
        { type: "operator", value: "<", column: 7 },
        { type: "number", value: "20", column: 9 },
      ] as Token[]);
    });

    it("debería manejar mayor o igual y menor o igual", () => {
      const line = "x >= 10 <= 20";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "identifier", value: "x", column: 0 },
        { type: "operator", value: ">=", column: 2 },
        { type: "number", value: "10", column: 5 },
        { type: "operator", value: "<=", column: 8 },
        { type: "number", value: "20", column: 11 },
      ] as Token[]);
    });

    it("debería manejar mayor o igual y menor o igual con cadenas", () => {
      const line = 'x >= "Hola" <= 20';
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "identifier", value: "x", column: 0 },
        { type: "operator", value: ">=", column: 2 },
        { type: "string", value: '"Hola"', column: 5 },
        { type: "operator", value: "<=", column: 11 },
        { type: "number", value: "20", column: 14 },
      ] as Token[]);
    });
  });

  describe("sentencias if", () => {
    it("debería manejar sentencias if", () => {
      const line = "if x > 10:";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "if", column: 0 },
        { type: "identifier", value: "x", column: 3 },
        { type: "operator", value: ">", column: 5 },
        { type: "number", value: "10", column: 7 },
        { type: "punctuation", value: ":", column: 9 },
      ] as Token[]);
    });

    it("debería manejar sentencias if con cadenas", () => {
      const line = 'if x == "Hola":';
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "if", column: 0 },
        { type: "identifier", value: "x", column: 3 },
        { type: "operator", value: "==", column: 5 },
        { type: "string", value: '"Hola"', column: 8 },
        { type: "punctuation", value: ":", column: 14 },
      ] as Token[]);
    });

    it("debería manejar sentencias else", () => {
      const line = "else:";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "else", column: 0 },
        { type: "punctuation", value: ":", column: 4 },
      ] as Token[]);
    });

    it("debería manejar sentencias else if", () => {
      const line = "else if x < 5:";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "else", column: 0 },
        { type: "keyword", value: "if", column: 5 },
        { type: "identifier", value: "x", column: 8 },
        { type: "operator", value: "<", column: 10 },
        { type: "number", value: "5", column: 12 },
        { type: "punctuation", value: ":", column: 13 },
      ] as Token[]);
    });
  });

  describe("sentencias while", () => {
    it("debería manejar sentencias while", () => {
      const line = "while x < 10:";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "while", column: 0 },
        { type: "identifier", value: "x", column: 6 },
        { type: "operator", value: "<", column: 8 },
        { type: "number", value: "10", column: 10 },
        { type: "punctuation", value: ":", column: 12 },
      ] as Token[]);
    });

    it("debería manejar sentencias while con cadenas", () => {
      const line = 'while x == "Hola":';
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "while", column: 0 },
        { type: "identifier", value: "x", column: 6 },
        { type: "operator", value: "==", column: 8 },
        { type: "string", value: '"Hola"', column: 11 },
        { type: "punctuation", value: ":", column: 17 },
      ] as Token[]);
    });

    it("debería manejar sentencias do while", () => {
      const line = "do:";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "do", column: 0 },
        { type: "punctuation", value: ":", column: 2 },
      ] as Token[]);
    });
  });

  describe("sentencias for", () => {
    it("debería manejar sentencias for", () => {
      const line = "for i = 1 to 10:";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "for", column: 0 },
        { type: "identifier", value: "i", column: 4 },
        { type: "operator", value: "=", column: 6 },
        { type: "number", value: "1", column: 8 },
        { type: "keyword", value: "to", column: 10 },
        { type: "number", value: "10", column: 13 },
        { type: "punctuation", value: ":", column: 15 },
      ] as Token[]);
    });

    it("debería manejar sentencias for con step", () => {
      const line = "for i = 1 to 10 step 2:";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "for", column: 0 },
        { type: "identifier", value: "i", column: 4 },
        { type: "operator", value: "=", column: 6 },
        { type: "number", value: "1", column: 8 },
        { type: "keyword", value: "to", column: 10 },
        { type: "number", value: "10", column: 13 },
        { type: "keyword", value: "step", column: 16 },
        { type: "number", value: "2", column: 21 },
        { type: "punctuation", value: ":", column: 22 },
      ] as Token[]);
    });

    it("debería manejar sentencias for con cadenas", () => {
      const line = 'for i = "Hola" to 10:';
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "for", column: 0 },
        { type: "identifier", value: "i", column: 4 },
        { type: "operator", value: "=", column: 6 },
        { type: "string", value: '"Hola"', column: 8 },
        { type: "keyword", value: "to", column: 14 },
        { type: "number", value: "10", column: 17 },
        { type: "punctuation", value: ":", column: 19 },
      ] as Token[]);
    });

    it("debería manejar sentencias for con cadenas y números", () => {
      const line = 'for i = "Hola" to 10:';
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "for", column: 0 },
        { type: "identifier", value: "i", column: 4 },
        { type: "operator", value: "=", column: 6 },
        { type: "string", value: '"Hola"', column: 8 },
        { type: "keyword", value: "to", column: 14 },
        { type: "number", value: "10", column: 17 },
        { type: "punctuation", value: ":", column: 19 },
      ] as Token[]);
    });
  });

  describe("sentencias switch", () => {
    it("debería manejar sentencias switch", () => {
      const line = "switch x:";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "switch", column: 0 },
        { type: "identifier", value: "x", column: 7 },
        { type: "punctuation", value: ":", column: 9 },
      ] as Token[]);
    });

    it("debería manejar sentencias case", () => {
      const line = "case 1:";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "case", column: 0 },
        { type: "number", value: "1", column: 5 },
        { type: "punctuation", value: ":", column: 6 },
      ] as Token[]);
    });

    it("debería manejar sentencias case con cadenas", () => {
      const line = 'case "Hola":';
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "case", column: 0 },
        { type: "string", value: '"Hola"', column: 5 },
        { type: "punctuation", value: ":", column: 11 },
      ] as Token[]);
    });

    it("debería manejar sentencias default", () => {
      const line = "default:";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "default", column: 0 },
        { type: "punctuation", value: ":", column: 7 },
      ] as Token[]);
    });
  });

  describe("Comentarios", () => {
    it("debería manejar comentarios de una línea", () => {
      const line = "# This is a comment";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([] as Token[]);
    });

    it("debería manejar código con comentario al final", () => {
      const line = "x = 10 # This is a comment";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "identifier", value: "x", column: 0 },
        { type: "operator", value: "=", column: 2 },
        { type: "number", value: "10", column: 4 },
      ] as Token[]);
    });
  });

  describe("Desconocidos", () => {
    it("debería manejar caracteres desconocidos", () => {
      const line = "@";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "unknown", value: "@", column: 0 },
      ] as Token[]);
    });

    it("debería manejar múltiples caracteres desconocidos", () => {
      const line = "@sss #aa $ffff %aaaaa";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "unknown", value: "@sss", column: 0 },
        { type: "unknown", value: "#aa", column: 5 },
        { type: "unknown", value: "$ffff", column: 8 },
        { type: "unknown", value: "%aaaaa", column: 14 },
      ] as Token[]);
    });
  });
});
