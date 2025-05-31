import type { Token } from "../types/Token";
import type { TokenType } from "../types/TokenType";

// Tabla de patrones regex para identificar tipos de tokens
const tableMatch: {
  regex: RegExp;
  type: TokenType;
}[] = [
  {
    // Palabras reservadas del lenguaje
    regex:
      /^let|^if|^else|^while|^const|^for|^do|^to|^step|^switch|^case|^default|^print$/,
    type: "keyword",
  },
  {
    // Dos puntos como puntuación
    regex: /^:$/,
    type: "punctuation",
  },
  {
    // Booleanos
    regex: /^true|^false$/,
    type: "boolean",
  },
  {
    // Números enteros
    regex: /^[0-9]+$/,
    type: "number",
  },
  {
    // Cadenas de texto entre comillas dobles
    regex: /^"([^"\\]|\\.)*"$/,
    type: "string",
  },
  {
    // Operadores (incluyendo operadores compuestos)
    regex: /^(?:\+\+|--|&&|\|\||[+\-*\/=<>!%])+$/,
    type: "operator",
  },
  {
    // Identificadores (variables, nombres de funciones, etc.)
    regex: /^[a-zA-Z_][a-zA-Z0-9_]*$/,
    type: "identifier",
  },
];

// Función principal del analizador léxico
const AnalizadorLexico = (line: string): Token[] => {
  // Ignora líneas vacías
  if (line.trimEnd() === "") {
    return [];
  }

  // Ignora líneas de comentario (que empiezan con "#")
  if (line.trimStart().startsWith("# ") || line.trimStart() === "#") {
    return [];
  }

  // Elimina comentarios al final de la línea (después de " #")
  const lineaSinComentario = line.includes(" #")
    ? line.split(" #")[0].trimEnd()
    : line.trimEnd();

  // Si la línea quedó vacía después de quitar el comentario, retorna vacío
  if (lineaSinComentario === "") {
    return [];
  }

  // Divide la línea en tokens, manteniendo strings entre comillas como un solo token
  // y separando el operador de negación (!) si está pegado a un identificador o número
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

  // Recorre cada elemento y lo clasifica según la tabla de patrones
  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < elementosLinea.length; i++) {
    const elemento = elementosLinea[i];
    let matched = false;

    // Busca el primer patrón que coincida con el elemento
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let x = 0; x < tableMatch.length; x++) {
      const { regex, type } = tableMatch[x];
      if (regex.test(elemento)) {
        tokens.push({
          type: type,
          value: elemento,
          column: line.indexOf(elemento), // Columna donde inicia el token
        });
        matched = true;
        break;
      }
    }

    // Si no coincide con ningún patrón, lo marca como "unknown"
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
