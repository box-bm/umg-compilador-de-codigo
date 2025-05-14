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

  describe("Variable assignment", () => {
    it("should detect variable assignment", () => {
      const line = "x = 10;";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "identifier", value: "x", column: 1 },
        { type: "operator", value: "=", column: 3 },
        { type: "number", value: "10", column: 5 },
        { type: "semicolon", value: ";", column: 7 },
      ] as Token[]);
    });

    it("should detect variable assignment with string", () => {
      const line = "name = 'John';";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "identifier", value: "name", column: 1 },
        { type: "operator", value: "=", column: 5 },
        { type: "string", value: "'John'", column: 7 },
        { type: "semicolon", value: ";", column: 13 },
      ] as Token[]);
    });

    it("should detect variable assignment with boolean", () => {
      const line = "isTrue = true;";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "identifier", value: "isTrue", column: 1 },
        { type: "operator", value: "=", column: 8 },
        { type: "boolean", value: "true", column: 10 },
        { type: "semicolon", value: ";", column: 14 },
      ] as Token[]);
    });

    it("should detect variable assignment with array", () => {
      const line = "arr = [1, 2, 3];";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "identifier", value: "arr", column: 1 },
        { type: "operator", value: "=", column: 5 },
        { type: "bracket", value: "[", column: 7 },
        { type: "number", value: "1", column: 8 },
        { type: "comma", value: ",", column: 9 },
        { type: "number", value: "2", column: 11 },
        { type: "comma", value: ",", column: 12 },
        { type: "number", value: "3", column: 14 },
        { type: "bracket", value: "]", column: 15 },
        { type: "semicolon", value: ";", column: 16 },
      ] as Token[]);
    });

    it("should detect variable assignment with object", () => {
      const line = "obj = { key: 'value' };";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "identifier", value: "obj", column: 1 },
        { type: "operator", value: "=", column: 5 },
        { type: "brace", value: "{", column: 7 },
        { type: "identifier", value: "key", column: 9 },
        { type: "colon", value: ":", column: 12 },
        { type: "string", value: "'value'", column: 14 },
        { type: "brace", value: "}", column: 22 },
        { type: "semicolon", value: ";", column: 23 },
      ] as Token[]);
    });
  });

  describe("if statements", () => {
    it("should detect if statement", () => {
      const line = "if (x > 10) { y = 20; }";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "if", column: 1 },
        { type: "bracket", value: "(", column: 3 },
        { type: "identifier", value: "x", column: 4 },
        { type: "operator", value: ">", column: 6 },
        { type: "number", value: "10", column: 8 },
        { type: "bracket", value: ")", column: 10 },
        { type: "brace", value: "{", column: 12 },
        { type: "identifier", value: "y", column: 14 },
        { type: "operator", value: "=", column: 16 },
        { type: "number", value: "20", column: 18 },
        { type: "semicolon", value: ";", column: 20 },
        { type: "brace", value: "}", column: 22 },
      ] as Token[]);
    });

    it("should detect if statement with else", () => {
      const line = "if (x > 10) { y = 20; } else { z = 30; }";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "if", column: 1 },
        { type: "bracket", value: "(", column: 3 },
        { type: "identifier", value: "x", column: 4 },
        { type: "operator", value: ">", column: 6 },
        { type: "number", value: "10", column: 8 },
        { type: "bracket", value: ")", column: 10 },
        { type: "brace", value: "{", column: 12 },
        { type: "identifier", value: "y", column: 14 },
        { type: "operator", value: "=", column: 16 },
        { type: "number", value: "20", column: 18 },
        { type: "semicolon", value: ";", column: 20 },
        { type: "brace", value: "}", column: 22 },
        { type: "keyword", value: "else", column: 24 },
        { type: "brace", value: "{", column: 29 },
        { type: "identifier", value: "z", column: 31 },
        { type: "operator", value: "=", column: 33 },
        { type: "number", value: "30", column: 35 },
        { type: "semicolon", value: ";", column: 37 },
        { type: "brace", value: "}", column: 39 },
      ]);
    });

    it("should detect if statement with else if", () => {
      const line = "if (x > 10) { y = 20; } else if (z < 5) { w = 15; }";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "if", column: 1 },
        { type: "bracket", value: "(", column: 3 },
        { type: "identifier", value: "x", column: 4 },
        { type: "operator", value: ">", column: 6 },
        { type: "number", value: "10", column: 8 },
        { type: "bracket", value: ")", column: 10 },
        { type: "brace", value: "{", column: 12 },
        { type: "identifier", value: "y", column: 14 },
        { type: "operator", value: "=", column: 16 },
        { type: "number", value: "20", column: 18 },
        { type: "semicolon", value: ";", column: 20 },
        { type: "brace", value: "}", column: 22 },
        { type: "keyword", value: "else", column: 24 },
        { type: "keyword", value: "if", column: 29 },
        { type: "bracket", value: "(", column: 31 },
        { type: "identifier", value: "z", column: 32 },
        { type: "operator", value: "<", column: 34 },
        { type: "number", value: "5", column: 36 },
        { type: "bracket", value: ")", column: 37 },
        { type: "brace", value: "{", column: 39 },
        { type: "identifier", value: "w", column: 41 },
        { type: "operator", value: "=", column: 43 },
        { type: "number", value: "15", column: 45 },
        { type: "semicolon", value: ";", column: 47 },
        { type: "brace", value: "}", column: 49 },
      ]);
    });

    it("should detect if statement with else if and else", () => {
      const line =
        "if (x > 10) { y = 20; } else if (z < 5) { w = 15; } else { v = 25; }";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "if", column: 1 },
        { type: "bracket", value: "(", column: 3 },
        { type: "identifier", value: "x", column: 4 },
        { type: "operator", value: ">", column: 6 },
        { type: "number", value: "10", column: 8 },
        { type: "bracket", value: ")", column: 10 },
        { type: "brace", value: "{", column: 12 },
        { type: "identifier", value: "y", column: 14 },
        { type: "operator", value: "=", column: 16 },
        { type: "number", value: "20", column: 18 },
        { type: "semicolon", value: ";", column: 20 },
        { type: "brace", value: "}", column: 22 },
        { type: "keyword", value: "else", column: 24 },
        { type: "keyword", value: "if", column: 29 },
        { type: "bracket", value: "(", column: 31 },
        { type: "identifier", value: "z", column: 32 },
        { type: "operator", value: "<", column: 34 },
        { type: "number", value: "5", column: 36 },
        { type: "bracket", value: ")", column: 37 },
        { type: "brace", value: "{", column: 39 },
        { type: "identifier", value: "w", column: 41 },
        { type: "operator", value: "=", column: 43 },
        { type: "number", value: "15", column: 45 },
        { type: "semicolon", value: ";", column: 47 },
        { type: "brace", value: "}", column: 49 },
        { type: "keyword", value: "else", column: 51 },
        { type: "brace", value: "{", column: 56 },
        { type: "identifier", value: "v", column: 58 },
        { type: "operator", value: "=", column: 60 },
        { type: "number", value: "25", column: 62 },
        { type: "semicolon", value: ";", column: 64 },
        { type: "brace", value: "}", column: 66 },
      ]);
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

    it("should detect arithmetic operators with parentheses", () => {
      const line = "let result = (a + b) * c;";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "let", column: 1 },
        { type: "identifier", value: "result", column: 5 },
        { type: "operator", value: "=", column: 12 },
        { type: "bracket", value: "(", column: 14 },
        { type: "identifier", value: "a", column: 15 },
        { type: "operator", value: "+", column: 17 },
        { type: "identifier", value: "b", column: 19 },
        { type: "bracket", value: ")", column: 21 },
        { type: "operator", value: "*", column: 23 },
        { type: "identifier", value: "c", column: 25 },
        { type: "semicolon", value: ";", column: 26 },
      ] as Token[]);
    });

    it("should detect arithmetic operators with multiple parentheses", () => {
      const line = "let result = ((a + b) * c) / d;";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "let", column: 1 },
        { type: "identifier", value: "result", column: 5 },
        { type: "operator", value: "=", column: 12 },
        { type: "bracket", value: "(", column: 14 },
        { type: "bracket", value: "(", column: 15 },
        { type: "identifier", value: "a", column: 16 },
        { type: "operator", value: "+", column: 18 },
        { type: "identifier", value: "b", column: 20 },
        { type: "bracket", value: ")", column: 22 },
        { type: "operator", value: "*", column: 24 },
        { type: "identifier", value: "c", column: 26 },
        { type: "bracket", value: ")", column: 28 },
        { type: "operator", value: "/", column: 30 },
        { type: "identifier", value: "d", column: 32 },
        { type: "semicolon", value: ";", column: 33 },
      ] as Token[]);
    });

    it("should detect arithmetic operators with multiple parentheses and negative numbers", () => {
      const line = "let result = ((a + b) * -c) / d;";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "let", column: 1 },
        { type: "identifier", value: "result", column: 5 },
        { type: "operator", value: "=", column: 12 },
        { type: "bracket", value: "(", column: 14 },
        { type: "bracket", value: "(", column: 15 },
        { type: "identifier", value: "a", column: 16 },
        { type: "operator", value: "+", column: 18 },
        { type: "identifier", value: "b", column: 20 },
        { type: "bracket", value: ")", column: 22 },
        { type: "operator", value: "*", column: 24 },
        { type: "operator", value: "-", column: 26 },
        { type: "identifier", value: "c", column: 27 },
        { type: "bracket", value: ")", column: 29 },
        { type: "operator", value: "/", column: 31 },
        { type: "identifier", value: "d", column: 33 },
        { type: "semicolon", value: ";", column: 34 },
      ] as Token[]);
    });

    it("should detect arithmetic operators with negative numbers", () => {
      const line = "let result = -a + b;";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "let", column: 1 },
        { type: "identifier", value: "result", column: 5 },
        { type: "operator", value: "=", column: 12 },
        { type: "operator", value: "-", column: 14 },
        { type: "identifier", value: "a", column: 15 },
        { type: "operator", value: "+", column: 17 },
        { type: "identifier", value: "b", column: 19 },
        { type: "semicolon", value: ";", column: 20 },
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

  describe("Functions", () => {
    it("should detect function declaration", () => {
      const line =
        "function add(a: number, b: number): number { return a + b; }";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "keyword", value: "function", column: 1 },
        { type: "identifier", value: "add", column: 9 },
        { type: "bracket", value: "(", column: 12 },
        { type: "identifier", value: "a", column: 13 },
        { type: "colon", value: ":", column: 14 },
        { type: "type", value: "number", column: 16 },
        { type: "comma", value: ",", column: 22 },
        { type: "identifier", value: "b", column: 24 },
        { type: "colon", value: ":", column: 25 },
        { type: "type", value: "number", column: 27 },
        { type: "bracket", value: ")", column: 33 },
        { type: "colon", value: ":", column: 34 },
        { type: "type", value: "number", column: 36 },
        { type: "brace", value: "{", column: 43 },
        { type: "keyword", value: "return", column: 45 },
        { type: "identifier", value: "a", column: 52 },
        { type: "operator", value: "+", column: 54 },
        { type: "identifier", value: "b", column: 56 },
        { type: "semicolon", value: ";", column: 57 },
        { type: "brace", value: "}", column: 59 },
      ] as Token[]);
    });

    it("should detect function call with arguments and parentheses ", () => {
      const line = "add(1,2);";
      const result = AnalizadorLexico(line);
      expect(result).toEqual([
        { type: "identifier", value: "add", column: 1 },
        { type: "bracket", value: "(", column: 4 },
        { type: "number", value: "1", column: 5 },
        { type: "comma", value: ",", column: 6 },
        {
          type: "number",
          value: "2",
          column: 8,
        },
        { type: "bracket", value: ")", column: 9 },
        { type: "semicolon", value: ";", column: 10 },
      ] as Token[]);
    });
  });
});
