import AnalizadorLexico from "./AnalizadorLexico";
import type Token from "../types/Token";

describe("AnalizadorLexico", () => {
  it("should handle empty lines with spaces", () => {
    const line = "   ";
    const result = AnalizadorLexico(line);
    expect(result).toEqual([] as Token[]);
  });

  describe("variable declarations", () => {
    it("should handle variable declarations", () => {
      const line = "let x = 10";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "let", column: 0 },
        { type: "identifier", value: "x", column: 4 },
        { type: "operator", value: "=", column: 6 },
        { type: "number", value: "10", column: 8 },
      ] as Token[]);
    });

    it("should handle constant declarations with strings", () => {
      const line = 'const y = "Hola"';
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "const", column: 0 },
        { type: "identifier", value: "y", column: 6 },
        { type: "operator", value: "=", column: 8 },
        { type: "string", value: '"Hola"', column: 10 },
      ] as Token[]);
    });

    it("should asign a value to a variable int", () => {
      const line = "x = 20";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "identifier", value: "x", column: 0 },
        { type: "operator", value: "=", column: 2 },
        { type: "number", value: "20", column: 4 },
      ] as Token[]);
    });

    it("should asign a value to a variable string", () => {
      const line = 'x = "Hola"';
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "identifier", value: "x", column: 0 },
        { type: "operator", value: "=", column: 2 },
        { type: "string", value: '"Hola"', column: 4 },
      ] as Token[]);
    });
  });

  describe("arithmetic operators", () => {
    it("should handle arithmetic operators", () => {
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

    it("should handle all arithmetic operators", () => {
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

    it("should handle arithmetic operators with numbers", () => {
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

    it("should handle arithmetic operators with strings and numbers", () => {
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

  describe("logical operators", () => {
    it("should handle logical operators", () => {
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

    it("should handle logical operators with numbers", () => {
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

    it("should handle logical operators, number with strings", () => {
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

    it("should negate a variable", () => {
      const line = "!x";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "operator", value: "!", column: 0 },
        { type: "identifier", value: "x", column: 1 },
      ] as Token[]);
    });
  });

  describe("comparison operators", () => {
    it("should handle comparison operators", () => {
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

    it("should handle comparison operators with numbers", () => {
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

    it("should handle comparison operators with strings and numbers", () => {
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

    it("should handle comparison more than and less than", () => {
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

    it("should handle comparison more than or equal and less than or equal", () => {
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

    it("should handle comparison more than or equal and less than or equal with strings", () => {
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

  describe("if statements", () => {
    it("should handle if statements", () => {
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

    it("should handle if statements with strings", () => {
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

    it("should handle else statements", () => {
      const line = "else:";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "else", column: 0 },
        { type: "punctuation", value: ":", column: 4 },
      ] as Token[]);
    });

    it("should handle else if statements", () => {
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

  describe("while statements", () => {
    it("should handle while statements", () => {
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

    it("should handle while statements with strings", () => {
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

    it("should handle do while statements", () => {
      const line = "do:";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "do", column: 0 },
        { type: "punctuation", value: ":", column: 2 },
      ] as Token[]);
    });
  });

  describe("for statements", () => {
    it("should handle for statemens", () => {
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

    it("should handle for statements with setp", () => {
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

    it("should handle for statements with strings", () => {
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

    it("should handle for statements with strings and numbers", () => {
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

  describe("switch statements", () => {
    it("should handle switch statements", () => {
      const line = "switch x:";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "switch", column: 0 },
        { type: "identifier", value: "x", column: 7 },
        { type: "punctuation", value: ":", column: 9 },
      ] as Token[]);
    });

    it("should handle case statements", () => {
      const line = "case 1:";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "case", column: 0 },
        { type: "number", value: "1", column: 5 },
        { type: "punctuation", value: ":", column: 6 },
      ] as Token[]);
    });

    it("should handle case statements with strings", () => {
      const line = 'case "Hola":';
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "case", column: 0 },
        { type: "string", value: '"Hola"', column: 5 },
        { type: "punctuation", value: ":", column: 11 },
      ] as Token[]);
    });

    it("should handle default statements", () => {
      const line = "default:";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "default", column: 0 },
        { type: "punctuation", value: ":", column: 7 },
      ] as Token[]);
    });
  });

  describe("tabulation", () => {
    it("should handle tabulation", () => {
      const line = "  let x = 10";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "let", column: 2 },
        { type: "identifier", value: "x", column: 6 },
        { type: "operator", value: "=", column: 8 },
        { type: "number", value: "10", column: 10 },
      ] as Token[]);
    });

    it("should handle multiple tabulations", () => {
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

  describe("Comentaries", () => {
    it("should handle single line comments", () => {
      const line = "# This is a comment";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([] as Token[]);
    });

    it("should handle code with comment at the end", () => {
      const line = "x = 10 # This is a comment";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "identifier", value: "x", column: 0 },
        { type: "operator", value: "=", column: 2 },
        { type: "number", value: "10", column: 4 },
      ] as Token[]);
    });
  });
});
