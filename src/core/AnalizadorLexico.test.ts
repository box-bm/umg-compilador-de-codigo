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

    it("should asign a value to a variable", () => {
      const line = "x = 20";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "identifier", value: "x", column: 0 },
        { type: "operator", value: "=", column: 2 },
        { type: "number", value: "20", column: 4 },
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
});
