import AnalizadorLexico from "./AnalizadorLexico";
import type Token from "../types/Token";

describe("AnalizadorLexico", () => {
  it("should handle empty lines with spaces", () => {
    const line = "   ";
    const result = AnalizadorLexico(line);
    expect(result).toEqual([] as Token[]);
  });

  describe("Variable definitions", () => {
    it("should detect boolean variable declaration", () => {
      const line = "let isTrue: boolean = true;";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "let", column: 1 },
        { type: "identifier", value: "isTrue", column: 5 },
        { type: "colon", value: ":", column: 11 },
        { type: "type", value: "boolean", column: 13 },
        { type: "operator", value: "=", column: 20 },
        { type: "boolean", value: "true", column: 22 },
        { type: "semicolon", value: ";", column: 26 },
      ] as Token[]);
    });
    
    it("should detect boolean variable declaration", () => {
      const line = "let isTrue: boolean = false;";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "let", column: 1 },
        { type: "identifier", value: "isTrue", column: 5 },
        { type: "colon", value: ":", column: 11 },
        { type: "type", value: "boolean", column: 13 },
        { type: "operator", value: "=", column: 20 },
        { type: "boolean", value: "false", column: 22 },
        { type: "semicolon", value: ";", column: 27 },
      ] as Token[]);
    });

    it("should detect string variable declaration", () => {
      const line = "let name: string = 'John';";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "let", column: 1 },
        { type: "identifier", value: "name", column: 5 },
        { type: "colon", value: ":", column: 9 },
        { type: "type", value: "string", column: 11 },
        { type: "operator", value: "=", column: 18 },
        { type: "string", value: "'John'", column: 20 },
        { type: "semicolon", value: ";", column: 26 },
      ] as Token[]);
    });

    it("should detect number variable declaration", () => {
      const line = "let age: number = 30;";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "let", column: 1 },
        { type: "identifier", value: "age", column: 5 },
        { type: "colon", value: ":", column: 8 },
        { type: "type", value: "number", column: 10 },
        { type: "operator", value: "=", column: 17 },
        { type: "number", value: "30", column: 19 },
        { type: "semicolon", value: ";", column: 21 },
      ] as Token[]);
    });

    it("should detect variable declaration with assignment", () => {
      const line = "let x = 10;";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "let", column: 1 },
        { type: "identifier", value: "x", column: 5 },
        { type: "operator", value: "=", column: 7 },
        { type: "number", value: "10", column: 9 },
        { type: "semicolon", value: ";", column: 11 },
      ] as Token[]);
    });

    it("should detect variable declaration with string assignment", () => {
      const line = "let name = 'John';";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "let", column: 1 },
        { type: "identifier", value: "name", column: 5 },
        { type: "operator", value: "=", column: 9 },
        { type: "string", value: "'John'", column: 11 },
        { type: "semicolon", value: ";", column: 17 },
      ] as Token[]);
    });

    it("should detect variable declaration with type assignment", () => {
      const line = "let x: number = 10;";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "let", column: 1 },
        { type: "identifier", value: "x", column: 5 },
        { type: "colon", value: ":", column: 6 },
        { type: "type", value: "number", column: 8 },
        { type: "operator", value: "=", column: 15 },
        { type: "number", value: "10", column: 17 },
        { type: "semicolon", value: ";", column: 19 },
      ] as Token[]);
    });

    it("should detect object declaration with braces", () => {
      const line = "const obj = { key: 'value' };";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "const", column: 1 },
        { type: "identifier", value: "obj", column: 7 },
        { type: "operator", value: "=", column: 11 },
        { type: "brace", value: "{", column: 13 },
        { type: "identifier", value: "key", column: 15 },
        { type: "colon", value: ":", column: 18 },
        { type: "string", value: "'value'", column: 20 },
        { type: "brace", value: "}", column: 28 },
        { type: "semicolon", value: ";", column: 29 },
      ] as Token[]);
    });

    it("should detect array declaration with brackets", () => {
      const line = "let arr: number[] = [1, 2, 3];";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "let", column: 1 },
        { type: "identifier", value: "arr", column: 5 },
        { type: "colon", value: ":", column: 8 },
        { type: "type", value: "number[]", column: 10 },
        { type: "operator", value: "=", column: 19 },
        { type: "bracket", value: "[", column: 21 },
        { type: "number", value: "1", column: 22 },
        { type: "comma", value: ",", column: 23 },
        { type: "number", value: "2", column: 25 },
        { type: "comma", value: ",", column: 26 },
        { type: "number", value: "3", column: 28 },
        { type: "bracket", value: "]", column: 29 },
        { type: "semicolon", value: ";", column: 30 },
      ] as Token[]);
    });
  });

  describe("Comments", () => {
    it("should ignore single-line comments", () => {
      const line = "// This is a comment";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([] as Token[]);
    });

    it("should ignore multi-line comments", () => {
      const line = "/* This is a multi-line comment */";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([] as Token[]);
    });

    it("should ignore comments with code", () => {
      const line = "let x = 10; // This is a comment";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "let", column: 1 },
        { type: "identifier", value: "x", column: 5 },
        { type: "operator", value: "=", column: 7 },
        { type: "number", value: "10", column: 9 },
        { type: "semicolon", value: ";", column: 11 },
      ] as Token[]);
    });

    it("should ignore comment block with code", () => {
      const line = "/* This is a comment */ let x = 10;";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "let", column: 1 },
        { type: "identifier", value: "x", column: 5 },
        { type: "operator", value: "=", column: 7 },
        { type: "number", value: "10", column: 9 },
        { type: "semicolon", value: ";", column: 11 },
      ] as Token[]);
    });

    it("Should ignore line in block comment starting with *", () => {
      const line = "* let x = 10;";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([] as Token[]);
    });
  });

  describe("Aritmetic Operators", () => {
    it("should detect arithmetic operators", () => {
      const line = "let sum = a + b - c * d / e;";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "let", column: 1 },
        { type: "identifier", value: "sum", column: 5 },
        { type: "operator", value: "=", column: 9 },
        { type: "identifier", value: "a", column: 11 },
        { type: "operator", value: "+", column: 13 },
        { type: "identifier", value: "b", column: 15 },
        { type: "operator", value: "-", column: 17 },
        { type: "identifier", value: "c", column: 19 },
        { type: "operator", value: "*", column: 21 },
        { type: "identifier", value: "d", column: 23 },
        { type: "operator", value: "/", column: 25 },
        { type: "identifier", value: "e", column: 27 },
        { type: "semicolon", value: ";", column: 28 },
      ] as Token[]);
    });
  });

  describe("Logical Operators", () => {
    it("should detect comparison operators", () => {
      const line = "a==b && c != d;";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "identifier", value: "a", column: 1 },
        { type: "operator", value: "==", column: 2 },
        { type: "identifier", value: "b", column: 4 },
        { type: "operator", value: "&&", column: 6 },
        { type: "identifier", value: "c", column: 9 },
        { type: "operator", value: "!=", column: 11 },
        { type: "identifier", value: "d", column: 14 },
        { type: "semicolon", value: ";", column: 15 },
      ] as Token[]);
    });

    it("Should detect logical operators more and less", () => {
      const line = "a > b && c < d;";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "identifier", value: "a", column: 1 },
        { type: "operator", value: ">", column: 3 },
        { type: "identifier", value: "b", column: 5 },
        { type: "operator", value: "&&", column: 7 },
        { type: "identifier", value: "c", column: 10 },
        { type: "operator", value: "<", column: 12 },
        { type: "identifier", value: "d", column: 14 },
        { type: "semicolon", value: ";", column: 15 },
      ] as Token[]);
    });

    it("should detect logical operatos more and less with equal", () => {
      const line = "a >= b && c <= d;";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "identifier", value: "a", column: 1 },
        { type: "operator", value: ">=", column: 3 },
        { type: "identifier", value: "b", column: 6 },
        { type: "operator", value: "&&", column: 8 },
        { type: "identifier", value: "c", column: 11 },
        { type: "operator", value: "<=", column: 13 },
        { type: "identifier", value: "d", column: 16 },
        { type: "semicolon", value: ";", column: 17 },
      ] as Token[]);
    });

    it("Should detect and logical operator", () => {
      const line = "a && b;";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "identifier", value: "a", column: 1 },
        { type: "operator", value: "&&", column: 3 },
        { type: "identifier", value: "b", column: 6 },
        { type: "semicolon", value: ";", column: 7 },
      ] as Token[]);
    });
    it("Should detect or logical operator", () => {
      const line = "a || b;";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "identifier", value: "a", column: 1 },
        { type: "operator", value: "||", column: 3 },
        { type: "identifier", value: "b", column: 6 },
        { type: "semicolon", value: ";", column: 7 },
      ] as Token[]);
    });

    it("should detect multiple logical operatos", () => {
      const line = "a && b || c;";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "identifier", value: "a", column: 1 },
        { type: "operator", value: "&&", column: 2 },
        { type: "identifier", value: "b", column: 5 },
        { type: "operator", value: "||", column: 7 },
        { type: "identifier", value: "c", column: 10 },
        { type: "semicolon", value: ";", column: 11 },
      ] as Token[]);
    });

    it("should detect logical operators with parentheses", () => {
      const line = "(a && b) || c";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "bracket", value: "(", column: 1 },
        { type: "identifier", value: "a", column: 2 },
        { type: "operator", value: "&&", column: 4 },
        { type: "identifier", value: "b", column: 7 },
        { type: "bracket", value: ")", column: 8 },
        { type: "operator", value: "||", column: 10 },
        { type: "identifier", value: "c", column: 13 },
      ] as Token[]);
    });
  });
});
