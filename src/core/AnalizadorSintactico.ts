import type {
  BodyStatement,
  ErrorDefinition,
  IfStatement,
  BinaryExpression,
  LogicalOperation,
  ComparisonExpression,
} from "../types/AST";
import type { Token } from "../types/Token";

// Operadores lógicos y de comparación soportados
const LOGICAL_OPS = ["&&", "||"];
const COMPARISON_OPS = ["<", ">", "<=", ">=", "==", "!="];

// Crea un objeto de error de sintaxis
function error(message: string, column: number, line: number): ErrorDefinition {
  return { type: "SyntaxError", message, column, line };
}

// Verifica si un token es un valor válido (número, string, booleano o identificador)
function isValueToken(token: Token) {
  return (
    token.type === "number" ||
    token.type === "string" ||
    token.type === "boolean" ||
    token.type === "identifier"
  );
}

// Verifica si un objeto es una definición de error
function isErrorDefinition(obj: unknown): obj is ErrorDefinition {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "type" in obj &&
    (obj as { type: string }).type === "SyntaxError"
  );
}

// =======================
// PARSE DE EXPRESIONES
// =======================

// Analiza una expresión y la convierte en un nodo del AST o un error
function parseExpression(
  tokens: Token[],
  line: number
):
  | Token
  | BinaryExpression
  | LogicalOperation
  | ComparisonExpression
  | ErrorDefinition {
  // Analiza un lado de una expresión (puede ser recursivo)
  function parseSide(
    expr:
      | Token[]
      | Token
      | BinaryExpression
      | LogicalOperation
      | ComparisonExpression
  ):
    | Token
    | BinaryExpression
    | LogicalOperation
    | ComparisonExpression
    | ErrorDefinition {
    if (Array.isArray(expr)) return parseExpression(expr, line);
    return expr;
  }

  // Verifica si hay tokens desconocidos en la expresión
  for (const t of tokens) {
    if (t.type === "unknown") {
      return error("No se puede usar un token desconocido", t.column, line);
    }
  }

  // Error: asignación de keyword
  if (
    tokens.length === 4 &&
    tokens[0].type === "keyword" &&
    (tokens[0].value === "let" || tokens[0].value === "const") &&
    tokens[1].type === "identifier" &&
    tokens[2].type === "operator" &&
    tokens[2].value === "=" &&
    tokens[3].type === "keyword"
  ) {
    return error("No se puede asignar un keyword", tokens[3].column, line);
  }

  // Error: asignación de token desconocido
  if (
    tokens.length === 4 &&
    tokens[0].type === "keyword" &&
    (tokens[0].value === "let" || tokens[0].value === "const") &&
    tokens[1].type === "identifier" &&
    tokens[2].type === "operator" &&
    tokens[2].value === "=" &&
    tokens[3].type === "unknown"
  ) {
    return error("Token desconocido", tokens[3].column, line);
  }

  // Operador lógico unario "!"
  if (
    tokens.length === 2 &&
    tokens[0].type === "operator" &&
    tokens[0].value === "!" &&
    isValueToken(tokens[1])
  ) {
    return {
      type: "logical_operation",
      operator: "!",
      left: tokens[1],
    };
  }

  // =======================
  // OPERADORES LÓGICOS (&&, ||)
  // =======================
  for (let i = tokens.length - 1; i >= 0; i--) {
    if (
      tokens[i].type === "operator" &&
      LOGICAL_OPS.includes(tokens[i].value)
    ) {
      // Error: operandos no válidos (keyword)
      if (
        tokens[i - 1]?.type === "keyword" ||
        tokens[i + 1]?.type === "keyword"
      ) {
        return error(
          "No se puede usar un keyword como operando",
          tokens[i + 1] && tokens[i + 1].type === "keyword"
            ? tokens[i + 1].column
            : tokens[i].column,
          line
        );
      }
      // Error: operandos no válidos (unknown)
      if (
        tokens[i - 1]?.type === "unknown" ||
        tokens[i + 1]?.type === "unknown"
      ) {
        return error(
          "No se puede usar un token desconocido",
          tokens[i - 1]?.type === "unknown"
            ? tokens[i - 1].column
            : tokens[i + 1].column,
          line
        );
      }
      // Construye el nodo de operación lógica
      const left = parseSide(tokens.slice(0, i));
      const right = parseSide(tokens.slice(i + 1));
      return {
        type: "logical_operation",
        operator: tokens[i].value as "&&" | "||",
        left: left as
          | Token
          | BinaryExpression
          | ComparisonExpression
          | LogicalOperation,
        right: right as
          | Token
          | BinaryExpression
          | ComparisonExpression
          | LogicalOperation,
      };
    }
  }

  // =======================
  // OPERADORES DE COMPARACIÓN (<, >, <=, >=, ==, !=)
  // =======================
  for (let i = 0; i < tokens.length; i++) {
    if (
      tokens[i].type === "operator" &&
      COMPARISON_OPS.includes(tokens[i].value)
    ) {
      // Error: operandos no válidos (keyword)
      if (
        tokens[i - 1]?.type === "keyword" ||
        tokens[i + 1]?.type === "keyword"
      ) {
        return error(
          "No se puede usar un keyword como operando",
          tokens[i + 1] && tokens[i + 1].type === "keyword"
            ? tokens[i + 1].column
            : tokens[i].column,
          line
        );
      }
      // Error: operandos no válidos (unknown)
      if (
        tokens[i - 1]?.type === "unknown" ||
        tokens[i + 1]?.type === "unknown"
      ) {
        return error(
          "No se puede usar un token desconocido",
          tokens[i - 1]?.type === "unknown"
            ? tokens[i - 1].column
            : tokens[i + 1].column,
          line
        );
      }
      // Construye el nodo de comparación
      return {
        type: "comparison_expression",
        operator: tokens[i].value as "<" | "<=" | ">" | ">=" | "==" | "!=",
        left: tokens[i - 1],
        right: tokens[i + 1],
      };
    }
  }

  // =======================
  // OPERADORES ARITMÉTICOS (*, /, %)
  // =======================
  for (let i = tokens.length - 1; i >= 0; i--) {
    if (
      tokens[i].type === "operator" &&
      ["*", "/", "%"].includes(tokens[i].value)
    ) {
      // Error: operandos no válidos (keyword)
      if (
        tokens[i - 1]?.type === "keyword" ||
        tokens[i + 1]?.type === "keyword"
      ) {
        return error(
          "No se puede usar un keyword como operando",
          tokens[i + 1] && tokens[i + 1].type === "keyword"
            ? tokens[i + 1].column
            : tokens[i].column,
          line
        );
      }
      // Error: operandos no válidos (unknown)
      if (
        tokens[i - 1]?.type === "unknown" ||
        tokens[i + 1]?.type === "unknown"
      ) {
        return error(
          "No se puede usar un token desconocido",
          tokens[i - 1]?.type === "unknown"
            ? tokens[i - 1].column
            : tokens[i + 1].column,
          line
        );
      }
      // Construye el nodo de expresión binaria
      const left = parseSide(tokens.slice(0, i));
      const right = parseSide(tokens.slice(i + 1));
      return {
        type: "binary_expression",
        operator: tokens[i].value,
        left: left as Token | BinaryExpression | ComparisonExpression,
        right: right as Token | BinaryExpression | ComparisonExpression,
      };
    }
  }

  // =======================
  // OPERADORES ARITMÉTICOS (+, -)
  // =======================
  for (let i = tokens.length - 1; i >= 0; i--) {
    if (tokens[i].type === "operator" && ["+", "-"].includes(tokens[i].value)) {
      // Error: operandos no válidos (keyword)
      if (
        tokens[i - 1]?.type === "keyword" ||
        tokens[i + 1]?.type === "keyword"
      ) {
        return error(
          "No se puede usar un keyword como operando",
          tokens[i + 1] && tokens[i + 1].type === "keyword"
            ? tokens[i + 1].column
            : tokens[i].column,
          line
        );
      }
      // Error: operandos no válidos (unknown)
      if (
        tokens[i - 1]?.type === "unknown" ||
        tokens[i + 1]?.type === "unknown"
      ) {
        return error(
          "No se puede usar un token desconocido",
          tokens[i - 1]?.type === "unknown"
            ? tokens[i - 1].column
            : tokens[i + 1].column,
          line
        );
      }
      // Construye el nodo de expresión binaria
      const left = parseSide(tokens.slice(0, i));
      const right = parseSide(tokens.slice(i + 1));
      return {
        type: "binary_expression",
        operator: tokens[i].value,
        left: left as Token | BinaryExpression | ComparisonExpression,
        right: right as Token | BinaryExpression | ComparisonExpression,
      };
    }
  }

  // Caso base: un solo valor
  if (tokens.length === 1 && isValueToken(tokens[0])) {
    return tokens[0];
  }

  // Error: token desconocido como único valor
  if (tokens.length === 1 && tokens[0].type === "unknown") {
    return error(
      "No se puede usar un token desconocido",
      tokens[0].column,
      line
    );
  }

  // Error: uso de keyword como operando
  if (tokens.some((t) => t.type === "keyword")) {
    const kw = tokens.find((t) => t.type === "keyword");
    return error(
      "No se puede usar un keyword como operando",
      kw ? kw.column : 0,
      line
    );
  }

  // Error: expresión inválida
  return error("Expresión inválida", tokens[0]?.column ?? 0, line);
}

// =======================
// UTILIDADES DE NODOS
// =======================

// Verifica si un nodo es un nodo de cuerpo válido (expresión binaria, lógica o comparación)
function isBodyNode(
  node: unknown
): node is BinaryExpression | LogicalOperation | ComparisonExpression {
  if (!node || typeof node !== "object") return false;
  if ((node as { type: string }).type === "binary_expression") return true;
  if ((node as { type: string }).type === "logical_operation") return true;
  if ((node as { type: string }).type === "comparison_expression") return true;
  return false;
}

// =======================
// PARSE DEL CUERPO PRINCIPAL
// =======================

// Analiza un bloque de líneas de tokens y construye el AST del cuerpo
function parseBody(
  tokenLines: Token[][],
  start: number,
  end: number
): BodyStatement | ErrorDefinition {
  const body: BodyStatement = [];
  let i = start;
  while (i < end) {
    const tokens = tokenLines[i];
    if (!tokens || tokens.length === 0) {
      i++;
      continue;
    }

    // =======================
    // PRINT
    // =======================
    if (tokens[0].type === "keyword" && tokens[0].value === "print") {
      if (tokens.length < 2) {
        return error("Falta argumento en print", tokens[0].column, i + 1);
      }
      // Analiza la expresión a imprimir
      const expr = parseExpression(tokens.slice(1), i + 1);
      if (isErrorDefinition(expr)) return expr;
      body.push({
        type: "print_statement",
        argument: expr,
      });
      i++;
      continue;
    }

    // =======================
    // DECLARACIÓN LET/CONST
    // =======================
    if (
      tokens[0].type === "keyword" &&
      (tokens[0].value === "let" || tokens[0].value === "const")
    ) {
      // let/const x (declaración sin asignación)
      if (tokens.length === 2) {
        if (tokens[1].type !== "identifier") {
          return error(
            `La variable${
              tokens[0].value === "const" ? " constante" : ""
            } no tiene nombre`,
            tokens[1]?.column ?? tokens[0].column,
            i + 1
          );
        }
        if (tokens[0].value === "const") {
          return error(
            "La variable constante no tiene valor",
            tokens[1].column,
            i + 1
          );
        }
        body.push({
          type: "new_variable_declaration",
          variable: tokens[1],
        });
        i++;
        continue;
      }
      // let/const x = valor (declaración con asignación)
      if (
        tokens.length >= 4 &&
        tokens[2].type === "operator" &&
        tokens[2].value === "="
      ) {
        if (tokens[1].type !== "identifier") {
          return error(
            `La variable${
              tokens[0].value === "const" ? " constante" : ""
            } no tiene nombre`,
            tokens[1]?.column ?? tokens[0].column,
            i + 1
          );
        }
        if (tokens[2].type !== "operator" || tokens[2].value !== "=") {
          return error(
            `Falta el signo igual en variables${
              tokens[0].value === "const" ? " constantes" : ""
            }`,
            tokens[2]?.column ?? tokens[1].column,
            i + 1
          );
        }
        const valueTokens = tokens.slice(3);
        if (valueTokens.length === 0) {
          return error(
            `Falta el valor de la variable${
              tokens[0].value === "const" ? " constante" : ""
            }`,
            tokens[2].column,
            i + 1
          );
        }
        const value = parseExpression(valueTokens, i + 1);
        if (isErrorDefinition(value)) return value;
        if (tokens[0].value === "const") {
          body.push({
            type: "constant_variable_declaration",
            variable: tokens[1],
            value: value as
              | Token
              | BinaryExpression
              | LogicalOperation
              | ComparisonExpression,
          });
        } else {
          body.push({
            type: "new_variable_declaration_assignment",
            variable: tokens[1],
            value: value as
              | Token
              | BinaryExpression
              | LogicalOperation
              | ComparisonExpression,
          });
        }
        i++;
        continue;
      }
      // let/const x = (faltan tokens)
      if (tokens.length === 3) {
        if (tokens[1].type !== "identifier") {
          return error(
            `La variable${
              tokens[0].value === "const" ? " constante" : ""
            } no tiene nombre`,
            tokens[1]?.column ?? tokens[0].column,
            i + 1
          );
        }
        if (tokens[2].type === "operator" && tokens[2].value === "=") {
          return error(
            `Falta el valor de la variable${
              tokens[0].value === "const" ? " constante" : ""
            }`,
            tokens[2].column,
            i + 1
          );
        }
        return error(
          `Falta el signo igual en variables${
            tokens[0].value === "const" ? " constantes" : ""
          }`,
          tokens[2]?.column ?? tokens[1].column,
          i + 1
        );
      }
      // let/const sin nombre
      if (tokens.length === 1) {
        return error(
          `La variable${
            tokens[0].value === "const" ? " constante" : ""
          } no tiene nombre`,
          tokens[0].column,
          i + 1
        );
      }
      // let/const con más de 4 tokens (error de sintaxis)
      return error(
        "Sintaxis inválida en declaración de variable",
        tokens[0].column,
        i + 1
      );
    }

    // =======================
    // ASIGNACIÓN
    // =======================
    if (
      tokens.length >= 3 &&
      tokens[0].type === "identifier" &&
      tokens[1].type === "operator" &&
      tokens[1].value === "="
    ) {
      const valueTokens = tokens.slice(2);
      if (valueTokens.length === 0)
        return error("Falta valor en la asignación", tokens[1].column, i + 1);
      const value = parseExpression(valueTokens, i + 1);
      if (isErrorDefinition(value)) return value;
      body.push({
        type: "assignment",
        variable: tokens[0],
        value,
      });
      i++;
      continue;
    }

    // =======================
    // IF / ELSE IF / ELSE
    // =======================
    if (tokens[0].type === "keyword" && tokens[0].value === "if") {
      // Extrae los tokens de la condición
      let condTokens = tokens.slice(1);
      if (
        condTokens.length > 0 &&
        condTokens[condTokens.length - 1].type === "punctuation" &&
        condTokens[condTokens.length - 1].value === ":"
      ) {
        condTokens = condTokens.slice(0, -1);
      }
      const cond = parseExpression(condTokens, i + 1);
      if (isErrorDefinition(cond)) return cond;
      // Verifica que la condición sea válida
      if (
        !isBodyNode(cond) &&
        cond.type !== "identifier" &&
        cond.type !== "number" &&
        cond.type !== "boolean" &&
        cond.type !== "string"
      )
        return error("Expresión inválida", tokens[0]?.column ?? 0, i + 1);

      // Determina el rango del cuerpo del if
      const bodyStart = i + 1;
      let bodyEnd = bodyStart;
      while (
        bodyEnd < end &&
        !isIfLine(tokenLines[bodyEnd]) &&
        !isElseLine(tokenLines[bodyEnd]) &&
        !isForLine(tokenLines[bodyEnd]) &&
        !isWhileLine(tokenLines[bodyEnd])
      )
        bodyEnd++;
      const ifBody = parseBody(tokenLines, bodyStart, bodyEnd);
      if (isErrorDefinition(ifBody)) return ifBody;
      let next = bodyEnd;

      // Maneja múltiples else if y else
      const currentIf: IfStatement = {
        type: "if_statement",
        condition: cond as Token | ComparisonExpression | LogicalOperation,
        body: ifBody as BodyStatement,
      };
      let lastIf = currentIf;
      let foundElseBody: BodyStatement | undefined = undefined;
      while (next < end && isElseLine(tokenLines[next])) {
        const elseTokens = tokenLines[next];
        if (
          elseTokens.length > 1 &&
          elseTokens[1].type === "keyword" &&
          elseTokens[1].value === "if"
        ) {
          // ELSE IF
          const elseIfCondTokens = elseTokens.slice(2);
          let elseIfCond = elseIfCondTokens;
          if (
            elseIfCond.length > 0 &&
            elseIfCond[elseIfCond.length - 1].type === "punctuation" &&
            elseIfCond[elseIfCond.length - 1].value === ":"
          ) {
            elseIfCond = elseIfCond.slice(0, -1);
          }
          const elseIfCondParsed = parseExpression(elseIfCond, next + 1);
          if (isErrorDefinition(elseIfCondParsed)) return elseIfCondParsed;
          if (
            !isBodyNode(elseIfCondParsed) &&
            elseIfCondParsed.type !== "identifier" &&
            elseIfCondParsed.type !== "number" &&
            elseIfCondParsed.type !== "boolean" &&
            elseIfCondParsed.type !== "string"
          )
            return error(
              "Expresión inválida",
              elseTokens[0]?.column ?? 0,
              next + 1
            );
          const elseIfBodyStart = next + 1;
          let elseIfBodyEnd = elseIfBodyStart;
          while (
            elseIfBodyEnd < end &&
            !isIfLine(tokenLines[elseIfBodyEnd]) &&
            !isElseLine(tokenLines[elseIfBodyEnd]) &&
            !isForLine(tokenLines[elseIfBodyEnd]) &&
            !isWhileLine(tokenLines[elseIfBodyEnd])
          )
            elseIfBodyEnd++;
          const elseIfBody = parseBody(
            tokenLines,
            elseIfBodyStart,
            elseIfBodyEnd
          );
          if (isErrorDefinition(elseIfBody)) return elseIfBody;
          const newElseIf: IfStatement = {
            type: "if_statement",
            condition: elseIfCondParsed as Token | ComparisonExpression | LogicalOperation,
            body: elseIfBody as BodyStatement,
          };
          lastIf.elseIf = newElseIf;
          lastIf = newElseIf;
          next = elseIfBodyEnd;
        } else {
          // ELSE
          const elseBodyStart = next + 1;
          let elseBodyEnd = elseBodyStart;
          while (
            elseBodyEnd < end &&
            !isIfLine(tokenLines[elseBodyEnd]) &&
            !isElseLine(tokenLines[elseBodyEnd]) &&
            !isForLine(tokenLines[elseBodyEnd]) &&
            !isWhileLine(tokenLines[elseBodyEnd])
          )
            elseBodyEnd++;
          foundElseBody = parseBody(
            tokenLines,
            elseBodyStart,
            elseBodyEnd
          ) as BodyStatement;
          next = elseBodyEnd;
          break; // Solo puede haber un else final
        }
      }
      if (foundElseBody) {
        currentIf.elseBody = foundElseBody;
      }
      body.push(currentIf);
      i = next;
      continue;
    }

    // =======================
    // WHILE
    // =======================
    if (tokens[0].type === "keyword" && tokens[0].value === "while") {
      // Extrae los tokens de la condición
      let condTokens = tokens.slice(1);
      if (
        condTokens.length > 0 &&
        condTokens[condTokens.length - 1].type === "punctuation" &&
        condTokens[condTokens.length - 1].value === ":"
      ) {
        condTokens = condTokens.slice(0, -1);
      }
      const cond = parseExpression(condTokens, i + 1);
      if (isErrorDefinition(cond)) return cond;
      // Verifica que la condición sea válida
      if (
        !isBodyNode(cond) &&
        cond.type !== "identifier" &&
        cond.type !== "number" &&
        cond.type !== "boolean" &&
        cond.type !== "string"
      )
        return error("Expresión inválida", tokens[0]?.column ?? 0, i + 1);

      // Determina el rango del cuerpo del while
      const bodyStart = i + 1;
      let bodyEnd = bodyStart;
      while (
        bodyEnd < end &&
        !isIfLine(tokenLines[bodyEnd]) &&
        !isElseLine(tokenLines[bodyEnd]) &&
        !isForLine(tokenLines[bodyEnd]) &&
        !isWhileLine(tokenLines[bodyEnd])
      )
        bodyEnd++;
      const whileBody = parseBody(tokenLines, bodyStart, bodyEnd);
      if (isErrorDefinition(whileBody)) return whileBody;
      body.push({
        type: "while_statement",
        condition: cond as Token | ComparisonExpression | LogicalOperation,
        body: whileBody as BodyStatement,
      });
      i = bodyEnd;
      continue;
    }

    // =======================
    // FOR
    // =======================
    if (tokens[0].type === "keyword" && tokens[0].value === "for") {
      let idx = 1;
      const iterator = tokens[idx];
      idx++;
      // Verifica que haya un '=' después del iterador
      if (tokens[idx].type !== "operator" || tokens[idx].value !== "=")
        return error("Sintaxis de for inválida", tokens[idx].column, i + 1);
      idx++;
      const init = tokens[idx];
      idx++;
      // Verifica que haya un 'to' después del valor inicial
      if (tokens[idx].type !== "keyword" || tokens[idx].value !== "to")
        return error("Sintaxis de for inválida", tokens[idx].column, i + 1);
      idx++;
      const endTok = tokens[idx];
      idx++;
      let step: Token | undefined = undefined;
      // Verifica si hay un 'step'
      if (
        tokens[idx] &&
        tokens[idx].type === "keyword" &&
        tokens[idx].value === "step"
      ) {
        idx++;
        step = tokens[idx];
        idx++;
      }
      // Verifica si hay ':' al final
      if (
        tokens[idx] &&
        tokens[idx].type === "punctuation" &&
        tokens[idx].value === ":"
      ) {
        // ok
      }
      // Determina el nivel de indentación del for
      const forIndent = tokens[0].column;
      const bodyStart = i + 1;
      let bodyEnd = bodyStart;
      while (
        bodyEnd < end &&
        tokenLines[bodyEnd] &&
        tokenLines[bodyEnd].length > 0 &&
        tokenLines[bodyEnd][0].column > forIndent
      ) {
        bodyEnd++;
      }
      const forBody = parseBody(tokenLines, bodyStart, bodyEnd);
      if (isErrorDefinition(forBody)) return forBody;
      body.push({
        type: "for_statement",
        iterator: {
          type: "new_variable_declaration",
          variable: iterator,
        },
        init,
        end: endTok,
        ...(step ? { step } : {}),
        body: forBody as BodyStatement,
      });
      i = bodyEnd;
      continue;
    }

    // =======================
    // EXPRESIONES
    // =======================
    // Analiza líneas que contienen operadores como expresiones independientes
    if (tokens.some((t) => t.type === "operator")) {
      const expr = parseExpression(tokens, i + 1);
      if (isErrorDefinition(expr)) return expr;
      if (isBodyNode(expr)) body.push(expr);
      else return error("Expresión inválida", tokens[0]?.column ?? 0, i + 1);
      i++;
      continue;
    }
    i++;
  }
  return body;
}

// =======================
// FUNCIONES AUXILIARES PARA DETECTAR LÍNEAS DE CONTROL
// =======================

// Verifica si una línea es un else
function isElseLine(tokens: Token[] | undefined): boolean {
  return (
    !!tokens &&
    tokens.length > 0 &&
    tokens[0].type === "keyword" &&
    tokens[0].value === "else"
  );
}
// Verifica si una línea es un if
function isIfLine(tokens: Token[] | undefined): boolean {
  return (
    !!tokens &&
    tokens.length > 0 &&
    tokens[0].type === "keyword" &&
    tokens[0].value === "if"
  );
}
// Verifica si una línea es un for
function isForLine(tokens: Token[] | undefined): boolean {
  return (
    !!tokens &&
    tokens.length > 0 &&
    tokens[0].type === "keyword" &&
    tokens[0].value === "for"
  );
}
// Verifica si una línea es un while
function isWhileLine(tokens: Token[] | undefined): boolean {
  return (
    !!tokens &&
    tokens.length > 0 &&
    tokens[0].type === "keyword" &&
    tokens[0].value === "while"
  );
}

// =======================
// FUNCIÓN PRINCIPAL DE ANALIZADOR SINTÁCTICO
// =======================

// Punto de entrada: recibe las líneas de tokens y retorna el AST o un error
export default function AnalizadorSintactico(
  tokenLines: Token[][]
): BodyStatement | ErrorDefinition {
  return parseBody(tokenLines, 0, tokenLines.length);
}
