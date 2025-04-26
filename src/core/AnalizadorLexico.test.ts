import AnalizadorLexico from "./AnalizadorLexico";

describe("AnalizadorLexico", () => {
  it("should tokenize a simple line correctly", () => {
    const linea = "int x = 10;";
    const tokens = AnalizadorLexico(linea);

    expect(tokens).toEqual([
      { type: "keyword", value: "int", column: 0 },
      { type: "identifier", value: "x", column: 4 },
      { type: "operator", value: "=", column: 6 },
      { type: "number", value: "10", column: 8 },
      { type: "end-of-line", value: ";", column: 10 },
    ]);
  });

  it("should tokenize a line with multiple tokens correctly", () => {
    const linea = "int x = 10; int y = 20;";
    const tokens = AnalizadorLexico(linea);

    expect(tokens).toEqual([
      { type: "keyword", value: "int", column: 0 },
      { type: "identifier", value: "x", column: 4 },
      { type: "operator", value: "=", column: 6 },
      { type: "number", value: "10", column: 8 },
      { type: "end-of-line", value: ";", column: 10 },
      { type: "keyword", value: "int", column: 12 },
      { type: "identifier", value: "y", column: 16 },
      { type: "operator", value: "=", column: 18 },
      { type: "number", value: "20", column: 20 },
      { type: "end-of-line", value: ";", column: 22 },
    ]);
  });

  it("should tokenize a line with texts correctly", () => {
    const linea = 'string name = "John Doe";';
    const tokens = AnalizadorLexico(linea);

    expect(tokens).toEqual([
      { type: "keyword", value: "string", column: 0 },
      { type: "identifier", value: "name", column: 7 },
      { type: "operator", value: "=", column: 12 },
      { type: "string", value: '"John Doe"', column: 14 },
      { type: "end-of-line", value: ";", column: 24 },
    ]);
  });

  it("should throw an error for unknown tokens", () => {
    const linea = "int x = @;";
    expect(() => AnalizadorLexico(linea)).toThrow("Unknown token at index 8");
  });
});
