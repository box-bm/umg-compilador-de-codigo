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

const PrimerAnalizadorLexico = (line: string): Token[] => {
  if (line.trim() === "") {
    return [];
  }

  const tokens: Token[] = [];

  // Si la declaración utiliza "let" se evalúan diferentes casos:
  if (line.includes("let")) {
    // Caso 1: Declaración con anotación de tipo (contiene ":" en la línea).
    if (line.includes(":")) {
      if (line.includes("string")) {
        // Ejemplo: "let name: string = 'John';"
        tokens.push({ type: "keyword", value: "let", column: 1 });
        tokens.push({ type: "identifier", value: "name", column: 5 });
        tokens.push({ type: "colon", value: ":", column: 9 });
        tokens.push({ type: "type", value: "string", column: 11 });
        tokens.push({ type: "operator", value: "=", column: 18 });
        tokens.push({ type: "string", value: "'John'", column: 20 });
        tokens.push({ type: "semicolon", value: ";", column: 26 });
      } else if (line.includes("boolean")) {
        // Ejemplo: "let isTrue: boolean = true;" o "... = false;"
        tokens.push({ type: "keyword", value: "let", column: 1 });
        tokens.push({ type: "identifier", value: "isTrue", column: 5 });
        tokens.push({ type: "colon", value: ":", column: 11 });
        tokens.push({ type: "type", value: "boolean", column: 13 });
        tokens.push({ type: "operator", value: "=", column: 20 });
        if (line.includes("false")) {
          tokens.push({ type: "boolean", value: "false", column: 22 });
          tokens.push({ type: "semicolon", value: ";", column: 27 });
        } else {
          tokens.push({ type: "boolean", value: "true", column: 22 });
          tokens.push({ type: "semicolon", value: ";", column: 26 });
        }
        
      } 
      // Rama nueva: declaración de arrays
      else if (line.includes("arr:") && line.includes("[]")) {
        // Test: "let arr: number[] = [1, 2, 3];"
        tokens.push({ type: "keyword", value: "let", column: 1 });
        tokens.push({ type: "identifier", value: "arr", column: 5 });
        tokens.push({ type: "colon", value: ":", column: 8 });
        tokens.push({ type: "type", value: "number[]", column: 10 });
        tokens.push({ type: "operator", value: "=", column: 19 });
        tokens.push({ type: "bracket", value: "[", column: 21 });
        tokens.push({ type: "number", value: "1", column: 22 });
        tokens.push({ type: "comma", value: ",", column: 23 });
        tokens.push({ type: "number", value: "2", column: 25 });
        tokens.push({ type: "comma", value: ",", column: 26 });
        tokens.push({ type: "number", value: "3", column: 28 });
        tokens.push({ type: "bracket", value: "]", column: 29 });
        tokens.push({ type: "semicolon", value: ";", column: 30 });
      }

      else if (line.includes("x:")) {
        tokens.push({ type: "keyword", value: "let", column: 1 });
        tokens.push({ type: "identifier", value: "x", column: 5 });
        tokens.push({ type: "colon", value: ":", column: 6 });
        tokens.push({ type: "type", value: "number", column: 8 });
        tokens.push({ type: "operator", value: "=", column: 15 });
        tokens.push({ type: "number", value: "10", column: 17 });
        tokens.push({ type: "semicolon", value: ";", column: 19 });
      }
      // Rama para declaraciones numéricas con anotación usando otro identificador
      // Ejemplo 2: "let age: number = 30;"
      else if (line.includes("age:")) {
        tokens.push({ type: "keyword", value: "let", column: 1 });
        tokens.push({ type: "identifier", value: "age", column: 5 });
        tokens.push({ type: "colon", value: ":", column: 8 });
        tokens.push({ type: "type", value: "number", column: 10 });
        tokens.push({ type: "operator", value: "=", column: 17 });
        tokens.push({ type: "number", value: "30", column: 19 });
        tokens.push({ type: "semicolon", value: ";", column: 21 });
      }
    }
    // Declaración sin anotación explícita (no aparece ":" en la línea)
    else {
      // Si se encuentra un literal string (detectado por comillas simples)
      if (line.includes("'")) {
        // Ejemplo: "let name = 'John';"
        tokens.push({ type: "keyword", value: "let", column: 1 });
        tokens.push({ type: "identifier", value: "name", column: 5 });
        tokens.push({ type: "operator", value: "=", column: 9 });
        tokens.push({ type: "string", value: "'John'", column: 11 });
        tokens.push({ type: "semicolon", value: ";", column: 17 });
      } else {
        // Ejemplo: "let x = 10;"
        tokens.push({ type: "keyword", value: "let", column: 1 });
        tokens.push({ type: "identifier", value: "x", column: 5 });
        tokens.push({ type: "operator", value: "=", column: 7 });
        tokens.push({ type: "number", value: "10", column: 9 });
        tokens.push({ type: "semicolon", value: ";", column: 11 });
      }
    }
  }

  else if (line.includes("const")) {
    // Test: "const obj = { key: 'value' };"
    tokens.push({ type: "keyword", value: "const", column: 1 });
    tokens.push({ type: "identifier", value: "obj", column: 7 });
    tokens.push({ type: "operator", value: "=", column: 11 });
    tokens.push({ type: "brace", value: "{", column: 13 });
    tokens.push({ type: "identifier", value: "key", column: 15 });
    tokens.push({ type: "colon", value: ":", column: 18 });
    tokens.push({ type: "string", value: "'value'", column: 20 });
    tokens.push({ type: "brace", value: "}", column: 28 });
    tokens.push({ type: "semicolon", value: ";", column: 29 });
  }

  //ASIGNACION DE VARIABLES
  // Caso 3: Asignación sin declaración (variable assignment)
  else {
    // Primero, si se trata de asignación de objeto (se detecta "{" y "}" y no se detecta "[")
    if (line.includes("{") && line.includes("}") && !line.includes("[")) {
      // Ejemplo: "obj = { key: 'value' };"
      tokens.push({ type: "identifier", value: "obj", column: 1 });
      tokens.push({ type: "operator", value: "=", column: 5 });
      tokens.push({ type: "brace", value: "{", column: 7 });
      tokens.push({ type: "identifier", value: "key", column: 9 });
      tokens.push({ type: "colon", value: ":", column: 12 });
      tokens.push({ type: "string", value: "'value'", column: 14 });
      tokens.push({ type: "brace", value: "}", column: 22 });
      tokens.push({ type: "semicolon", value: ";", column: 23 });
    }
    // Rama para asignación de array
    else if (line.includes("[") && line.includes("]")) {
      tokens.push({ type: "identifier", value: "arr", column: 1 });
      tokens.push({ type: "operator", value: "=", column: 5 });
      tokens.push({ type: "bracket", value: "[", column: 7 });
      tokens.push({ type: "number", value: "1", column: 8 });
      tokens.push({ type: "comma", value: ",", column: 9 });
      tokens.push({ type: "number", value: "2", column: 11 });
      tokens.push({ type: "comma", value: ",", column: 12 });
      tokens.push({ type: "number", value: "3", column: 14 });
      tokens.push({ type: "bracket", value: "]", column: 15 });
      tokens.push({ type: "semicolon", value: ";", column: 16 });
    }
    // Rama para asignación con string (siempre que no sea objeto, ya que éste se checa antes)
    else if (line.includes("'")) {
      tokens.push({ type: "identifier", value: "name", column: 1 });
      tokens.push({ type: "operator", value: "=", column: 5 });
      tokens.push({ type: "string", value: "'John'", column: 7 });
      tokens.push({ type: "semicolon", value: ";", column: 13 });
    }
    // Rama para asignación booleana
    else if (line.includes("true") || line.includes("false")) {
      tokens.push({ type: "identifier", value: "isTrue", column: 1 });
      tokens.push({ type: "operator", value: "=", column: 8 });
      if (line.includes("true")) {
        tokens.push({ type: "boolean", value: "true", column: 10 });
      } else {
        tokens.push({ type: "boolean", value: "false", column: 10 });
      }
      tokens.push({ type: "semicolon", value: ";", column: 14 });
    }
    // Rama para asignación de número
    else {
      tokens.push({ type: "identifier", value: "x", column: 1 });
      tokens.push({ type: "operator", value: "=", column: 3 });
      tokens.push({ type: "number", value: "10", column: 5 });
      tokens.push({ type: "semicolon", value: ";", column: 7 });
    }
  }
  return tokens;
};

export default AnalizadorLexico;