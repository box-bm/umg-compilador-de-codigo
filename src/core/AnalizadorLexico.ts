import Token from "../types/Token";
import TokenType from "../types/TokenType";

const tableMatch: {
  regex: RegExp;
  type: TokenType;
}[] = [
  {
    regex: /^let|^if|^else|^while|^for$/,
    type: 'keyword',
  },
  {
    regex: /^:$/,
    type: 'punctuation'
  },
  {
    regex: /^true|^false$/,
    type: 'boolean',
  },
  {
    regex: /^[0-9]+$/,
    type: 'number',
  },
  {
    regex: /^"([^"\\]|\\.)*"$/,
    type: 'string',
  },
  {
    regex: /^[+\-*\/=<>!]+$/,
    type: 'operator',
  },
  {
    regex: /^[a-zA-Z_][a-zA-Z0-9_]*$/,
    type: 'identifier',
  },
];
  
const AnalizadorLexico = (line: string): Token[] => {
  if(line.trimEnd() === "") {
    return [];
  }

  // let x = 10 + 5
  const elementosLinea = line.split(" ");
  // ['let', 'x', '=', '10', '+', '5']
  // i = 0
  const tokens: Token[] = [];

  // Pasa por cada elemento de la linea
  for (let i = 0; i < elementosLinea.length; i++) {
    const elemento = elementosLinea[i];

    // Pasa por cada elemento de la tabla de coincidencias
    // Si el elemento coincide con la expresion regular, se agrega a la lista de tokens
    for (let x = 0; x < tableMatch.length; x++) {
      const { regex, type } = tableMatch[x];
      if (regex.test(elemento)) {
        tokens.push({
          type: type,
          value: elemento,
          column: line.indexOf(elemento),
        });
        break;
      }
    }

  }

  return tokens;
};

export default AnalizadorLexico;
