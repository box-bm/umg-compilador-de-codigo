import AnalizadorSemantico from './AnalizadorSemantico';

describe('AnalizadorSemantico', () => {
  it('should throw an error if the input is not a string', () => {
    const input = 123;
    expect(() => AnalizadorSemantico(input)).toThrow('Input must be a string');
  });

  it('should return an object with the correct properties', () => {
    const input = 'some input';
    const result = AnalizadorSemantico(input);
    expect(result).toHaveProperty('property1');
    expect(result).toHaveProperty('property2');
  });

  it('should handle empty strings correctly', () => {
    const input = '';
    const result = AnalizadorSemantico(input);
    expect(result).toEqual({ property1: '', property2: '' });
  });
});