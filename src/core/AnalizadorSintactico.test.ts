import { AnalizadorSintactico } from "./AnalizadorSintactico";

describe("first", () => {
  it("should return the first element of an array", () => {
    const input = [1, 2, 3];
    const result = AnalizadorSintactico(input);
    expect(result).toBe(1);
  });

  it("should return undefined for an empty array", () => {
    const input: number[] = [];
    const result = AnalizadorSintactico(input);
    expect(result).toBeUndefined();
  });
});
