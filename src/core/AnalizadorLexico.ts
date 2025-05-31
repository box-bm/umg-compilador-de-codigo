import type { Token } from "../types/Token";
import type { TokenType } from "../types/TokenType";

const tableMatch: {
  regex: RegExp;
  type: TokenType;
}[] = [
  {
    regex:
      /^let|^if|^else|^while|^const|^for|^do|^to|^step|^switch|^case|^default|^print$/,
    type: "keyword",
  },
  {
    regex: /^:$/,
    type: "punctuation",
  },
  {
    regex: /^true|^false$/,
    type: "boolean",
  },
  {
    regex: /^[0-9]+$/,
    type: "number",
  },
  {
    regex: /^"([^"\\]|\\.)*"$/,
    type: "string",
  },
  {
    regex: /^(?:\+\+|--|&&|\|\||[+\-*\/=<>!%])+$/,
    type: "operator",
  },
  {
    regex: /^[a-zA-Z_][a-zA-Z0-9_]*$/,
    type: "identifier",
  },
];

const AnalizadorLexico = (line: string): Token[] => {
  if (line.trimEnd() === "") {
    return [];
  }

  if (line.trimStart().startsWith("# ") || line.trimStart() === "#") {
    return [];
  }

  const lineaSinComentario = line.includes(" #")
    ? line.split(" #")[0].trimEnd()
    : line.trimEnd();

  if (lineaSinComentario === "") {
    return [];
  }

  // Divide la línea en elementos, manteniendo los strings entre comillas como un solo token
  // y separando los operadores de negación (!) cuando están pegados a un identificador o número
  const elementosLinea: string[] = [];
  const regex = /"([^"\\]|\\.)*"|[^\s]+/g;
  let match;
  while ((match = regex.exec(lineaSinComentario)) !== null) {
    const token = match[0];
    // Si el token empieza con '!' y no es solo '!'
    if (token.length > 1 && token[0] === "!" && token !== "!=") {
      elementosLinea.push("!");
      elementosLinea.push(token.slice(1));
    } else {
      elementosLinea.push(token);
    }
  }

  const tokens: Token[] = [];

  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < elementosLinea.length; i++) {
    const elemento = elementosLinea[i];
    let matched = false;

    // Valida cada palabra en la línea con las expresiones regulares
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let x = 0; x < tableMatch.length; x++) {
      const { regex, type } = tableMatch[x];
      if (regex.test(elemento)) {
        tokens.push({
          type: type,
          value: elemento,
          column: line.indexOf(elemento),
        });
        matched = true;
        break;
      }
    }

    if (!matched) {
      tokens.push({
        type: "unknown",
        value: elemento,
        column: line.indexOf(elemento),
      });
    }
  }

  return tokens;
};

export default AnalizadorLexico;
