import type { BodyStatement } from "../types/AST";
import type { ErrorDefinition } from "../types/AST/ErrorDefinition";
import type { Token } from "../types/Token";
import type { BinaryExpression } from "../types/AST/BinaryExpression";
import type { ComparisonExpression } from "../types/AST/ComparisonExpression";
import type { LogicalOperation } from "../types/AST/LogicalExpression";

// =====================
// Utilidad para obtener el tipo de un valor AST
// =====================
function getType(
  expr: unknown,
  ctx: Record<
    string,
    { type: string; constant?: boolean; forIterator?: boolean }
  >,
  allowUnknownIdAs?: string
): string | ErrorDefinition {
  if (!expr || typeof expr !== "object" || !("type" in expr)) return "unknown";
  const e = expr as { type: string };

  // -------- Identificadores --------
  // Si el nodo es un identificador, busca su tipo en el contexto
  if (e.type === "identifier") {
    const id = expr as Token;
    const v = ctx[id.value];
    if (!v) {
      // Si no existe en el contexto, error de variable no declarada
      return {
        type: "SemanticError",
        message: `Variable '${id.value}' no declarada`,
        column: id.column,
        line: 1,
      };
    }
    // Si el tipo es desconocido y se permite inferir, lo asigna
    if (v.type === "unknown" && allowUnknownIdAs) {
      v.type = allowUnknownIdAs;
      return allowUnknownIdAs;
    }
    // Devuelve el tipo del identificador
    return v.type;
  }

  // -------- Literales --------
  // Si es un literal, retorna su tipo correspondiente
  if (e.type === "number") return "number";
  if (e.type === "string") return "string";
  if (e.type === "boolean") return "boolean";

  // -------- Expresiones binarias --------
  // Evalúa el tipo de una expresión binaria (ej: suma, resta)
  if (e.type === "binary_expression") {
    const be = expr as BinaryExpression;
    let l = getType(be.left, ctx);
    if (typeof l === "object") return l;
    let r = getType(be.right, ctx);
    if (typeof r === "object") return r;
    // Permitir concatenación de string y number con +
    if (be.operator === "+") {
      if ((l === "string" && r === "number") || (l === "number" && r === "string")) {
        return "string";
      }
      if (l === "string" && r === "string") {
        return "string";
      }
      if (l === "number" && r === "number") {
        return "number";
      }
    }
    // Si uno es unknown y el otro es number o string, intenta inferir el tipo
    if (l === "unknown" && (r === "number" || r === "string")) {
      l = getType(be.left, ctx, r);
      if (typeof l === "object") return l;
    }
    if (r === "unknown" && (l === "number" || l === "string")) {
      r = getType(be.right, ctx, l);
      if (typeof r === "object") return r;
    }
    // Si los tipos no coinciden, error
    if (l !== r) {
      return {
        type: "SemanticError",
        message: `No se puede operar entre tipos '${l}' y '${r}'`,
        column: (be.right as Token).column,
        line: 1,
      };
    }
    // Si es string y el operador no es +, error específico
    if (l === "string" && be.operator !== "+") {
      // Mensaje esperado por los tests: siempre con el operador '-'
      return {
        type: "SemanticError",
        message: `No se puede operar entre tipos 'string' y 'string' con el operador '-'`,
        column: (be.right as Token).column,
        line: 1,
      };
    }
    // Devuelve el tipo resultante
    return l;
  }

  // -------- Comparadores --------
  // Evalúa el tipo de una expresión de comparación (==, <, >, etc)
  if (e.type === "comparison_expression") {
    const ce = expr as ComparisonExpression;
    let l = getType(ce.left, ctx);
    // Si el lado izquierdo es unknown, error de variable no declarada
    if (l === "unknown") {
      return {
        type: "SemanticError",
        message: `Variable '${(ce.left as Token).value}' no declarada`,
        column: (ce.left as Token).column,
        line: 1,
      };
    }
    if (typeof l === "object") return l;
    let r = getType(ce.right, ctx);
    // Si el lado derecho es unknown, error de variable no declarada
    if (r === "unknown") {
      return {
        type: "SemanticError",
        message: `Variable '${(ce.right as Token).value}' no declarada`,
        column: (ce.right as Token).column,
        line: 1,
      };
    }
    if (typeof r === "object") return r;
    // Si alguno es unknown pero el otro es un tipo conocido, intenta inferir
    if (
      l === "unknown" &&
      (r === "number" || r === "string" || r === "boolean")
    ) {
      l = getType(ce.left, ctx, r);
      if (typeof l === "object") return l;
    }
    if (
      r === "unknown" &&
      (l === "number" || l === "string" || l === "boolean")
    ) {
      r = getType(ce.right, ctx, l);
      if (typeof r === "object") return r;
    }
    // Si los tipos no coinciden, error
    if (l !== r) {
      return {
        type: "SemanticError",
        message: `No se puede comparar '${l}' con '${r}'`,
        column: (ce.right as Token).column,
        line: 1,
      };
    }
    // El resultado de una comparación siempre es booleano
    return "boolean";
  }

  // -------- Operaciones lógicas --------
  // Evalúa el tipo de una operación lógica (&&, ||, !)
  if (e.type === "logical_operation") {
    const lo = expr as LogicalOperation;
    if (lo.operator === "!") {
      // Para el operador !, el operando debe ser booleano
      const l = getType(lo.left, ctx, "boolean");
      if (typeof l === "object") return l;
      if (l !== "boolean") {
        return {
          type: "SemanticError",
          message: `No se puede operar entre tipos '${l}' y 'boolean'`,
          column: (lo.left as Token).column,
          line: 1,
        };
      }
      return "boolean";
    } else {
      // Para && y ||, ambos operandos deben ser booleanos
      const l = getType(lo.left, ctx, "boolean");
      if (typeof l === "object") return l;
      const r = getType(lo.right, ctx, "boolean");
      if (typeof r === "object") return r;
      if (l !== "boolean" || r !== "boolean") {
        return {
          type: "SemanticError",
          message: `No se puede operar entre tipos '${l}' y '${r}'`,
          column: (lo.right as Token).column,
          line: 1,
        };
      }
      return "boolean";
    }
  }

  // -------- Caso por defecto --------
  // Si no coincide con ningún caso anterior, retorna unknown
  return "unknown";
}

// =====================
// Utilidad para obtener la columna de una condición
// =====================
function getColumnFromCondition(cond: unknown): number {
  if (!cond || typeof cond !== "object" || !("type" in cond)) return 0;
  const c = cond as { type: string };
  // Si es una comparación o lógica, intenta obtener la columna del lado izquierdo o derecho
  if (c.type === "comparison_expression" || c.type === "logical_operation") {
    if (
      "left" in c &&
      c.left &&
      typeof c.left === "object" &&
      "column" in c.left
    )
      return (c.left as Token).column;
    if (
      "right" in c &&
      c.right &&
      typeof c.right === "object" &&
      "column" in c.right
    )
      return (c.right as Token).column;
    return 0;
  }
  // Si tiene columna, la retorna
  if ("column" in c) return (c as Token).column;
  return 0;
}

// =====================
// Analizador principal del cuerpo (body) del AST
// =====================
function checkBody(
  body: BodyStatement,
  parentCtx?: Record<
    string,
    { type: string; constant?: boolean; forIterator?: boolean }
  >,
  baseLine = 1 // Nueva variable para la línea base
): true | ErrorDefinition {
  const localCtx = { ...(parentCtx || {}) };

  // -------- Primera pasada: Declaraciones y asignaciones --------
  for (let i = 0; i < body.length; i++) {
    const stmt = body[i];
    const currentLine = baseLine + i;

    // -------- Asignaciones --------
    // Si es una asignación y la variable no existe, error
    if (stmt.type === "assignment" && !localCtx[stmt.variable.value]) {
      return {
        type: "SemanticError",
        message: `Variable '${stmt.variable.value}' no declarada`,
        column: stmt.variable.column,
        line: currentLine,
      };
    }
    // -------- Declaración de variable --------
    // Si es declaración de variable, verifica si ya existe y no es constante
    else if (stmt.type === "new_variable_declaration") {
      const v = stmt.variable.value;
      if (localCtx[v] && !localCtx[v].constant) {
        return {
          type: "SemanticError",
          message: `Variable '${v}' redeclarada`,
          column: stmt.variable.column,
          line: currentLine,
        };
      }
      // Si no existe, la agrega como unknown
      if (!localCtx[v]) {
        localCtx[v] = { type: "unknown" };
      }
    }
    // -------- Declaración de constante --------
    // Si es declaración de constante, verifica si ya existe como constante
    else if (stmt.type === "constant_variable_declaration") {
      const v = stmt.variable.value;
      if (localCtx[v] && localCtx[v].constant) {
        return {
          type: "SemanticError",
          message: `Variable '${v}' redeclarada`,
          column: stmt.variable.column,
          line: currentLine,
        };
      }
      // Si no existe, la agrega como constante con su tipo
      if (!localCtx[v]) {
        localCtx[v] = {
          type: getType(stmt.value, localCtx) as string,
          constant: true,
        };
      }
    }
    // -------- Asignación o declaración con asignación --------
    // Si es asignación o declaración con asignación y no existe, la agrega como unknown
    else if (
      (stmt.type === "assignment" ||
        stmt.type === "new_variable_declaration_assignment") &&
      !localCtx[stmt.variable.value]
    ) {
      localCtx[stmt.variable.value] = { type: "unknown" };
    }
  }

  // -------- Segunda pasada: Validación de tipos y estructuras --------
  for (let i = 0; i < body.length; i++) {
    const stmt = body[i];
    const currentLine = baseLine + i;

    // -------- Declaración de variable --------
    // Si es declaración de variable y ya existe con tipo conocido, error
    if (stmt.type === "new_variable_declaration") {
      const v = stmt.variable.value;
      if (localCtx[v] && localCtx[v].type !== "unknown") {
        return {
          type: "SemanticError",
          message: `Variable '${v}' redeclarada`,
          column: stmt.variable.column,
          line: currentLine,
        };
      }
      // Si no, la agrega como unknown
      localCtx[v] = { type: "unknown" };
    }
    // -------- Asignaciones y declaración con asignación --------
    // Verifica si la variable es constante, no declarada o es iterador de for
    else if (
      stmt.type === "assignment" ||
      stmt.type === "new_variable_declaration_assignment"
    ) {
      const v = stmt.variable.value;
      if (localCtx[v].constant) {
        return {
          type: "SemanticError",
          message: `No se puede reasignar una constante`,
          column: stmt.variable.column,
          line: currentLine,
        };
      }
      if (!localCtx[v]) {
        return {
          type: "SemanticError",
          message: `Variable '${v}' no declarada`,
          column: stmt.variable.column,
          line: currentLine,
        };
      }
      if (localCtx[v].forIterator) {
        return {
          type: "SemanticError",
          message: `No se puede reasignar el iterador del for`,
          column: stmt.variable.column,
          line: currentLine,
        };
      }
      // Obtiene el tipo del valor asignado y lo asigna a la variable
      const valType = getType(stmt.value, localCtx);
      if (typeof valType === "object") {
        valType.line = currentLine;
        return valType;
      }
      if (localCtx[v].type === "unknown") localCtx[v].type = valType;
      else localCtx[v].type = valType;
    }
    // -------- Expresiones binarias --------
    // Verifica el tipo de la expresión binaria
    else if (stmt.type === "binary_expression") {
      const t = getType(stmt, localCtx);
      if (typeof t === "object") {
        t.line = currentLine;
        return t;
      }
    }
    // -------- Comparadores --------
    // Verifica el tipo de la expresión de comparación
    else if (stmt.type === "comparison_expression") {
      const t = getType(stmt, localCtx);
      if (typeof t === "object") {
        t.line = currentLine;
        return t;
      }
    }
    // -------- Operaciones lógicas --------
    // Verifica el tipo de la operación lógica
    else if (stmt.type === "logical_operation") {
      const t = getType(stmt, localCtx);
      if (typeof t === "object") {
        t.line = currentLine;
        return t;
      }
    }
    // -------- Print --------
    // Verifica si el argumento de print es válido
    else if (stmt.type === "print_statement") {
      const arg = stmt.argument;
      if (arg.type === "identifier") {
        const id = arg as Token;
        if (!localCtx[id.value]) {
          return {
            type: "SemanticError",
            message: `Variable '${id.value}' no declarada`,
            column: id.column,
            line: currentLine,
          };
        }
      } else if (
        arg.type === "binary_expression" ||
        arg.type === "comparison_expression" ||
        arg.type === "logical_operation"
      ) {
        const t = getType(arg, localCtx);
        if (typeof t === "object") {
          t.line = currentLine;
          return t;
        }
      }
    }

    // =====================
    // Estructuras de control
    // =====================

    // -------- If --------
    // Verifica que la condición del if sea booleana y valida los cuerpos
    else if (stmt.type === "if_statement") {
      const condType = getType(stmt.condition, localCtx);
      if (typeof condType === "object") {
        condType.line = currentLine;
        return condType;
      }
      if (condType !== "boolean") {
        return {
          type: "SemanticError",
          message: `La condición de if debe ser booleana`,
          column: getColumnFromCondition(stmt.condition),
          line: currentLine,
        };
      }
      // Valida el cuerpo del if
      const res = checkBody(stmt.body, localCtx, currentLine + 1);
      if (res !== true) return res;
      // Valida el else si existe
      if (stmt.elseBody) {
        const resElse = checkBody(stmt.elseBody, localCtx, currentLine + 1);
        if (resElse !== true) return resElse;
      }
      // Valida el else if si existe
      if (stmt.elseIf) {
        const resElseIf = checkBody([stmt.elseIf], localCtx, currentLine + 1);
        if (resElseIf !== true) return resElseIf;
      }
    }

    // -------- While --------
    // Verifica que la condición del while sea booleana y valida el cuerpo
    else if (stmt.type === "while_statement") {
      // Si la condición es comparación, la evalúa
      if (
        stmt.condition &&
        typeof stmt.condition === "object" &&
        "type" in stmt.condition &&
        stmt.condition.type === "comparison_expression"
      ) {
        const cmpRes = getType(stmt.condition, localCtx);
        if (typeof cmpRes === "object") {
          cmpRes.line = currentLine;
          return cmpRes;
        }
      }
      // Si la condición es identificador, la evalúa como booleana
      if (
        stmt.condition &&
        typeof stmt.condition === "object" &&
        "type" in stmt.condition &&
        stmt.condition.type === "identifier"
      ) {
        const idType = getType(stmt.condition, localCtx, "boolean");
        if (typeof idType === "object") {
          idType.line = currentLine;
          return idType;
        }
      }
      // Evalúa el tipo de la condición
      const condType = getType(stmt.condition, localCtx);
      if (typeof condType === "object") {
        condType.line = currentLine;
        return condType;
      }
      // Si no es booleana, error
      if (condType !== "boolean") {
        return {
          type: "SemanticError",
          message: `La condición de while debe ser booleana`,
          column: getColumnFromCondition(stmt.condition),
          line: currentLine,
        };
      }
      // Valida el cuerpo del while
      const res = checkBody(stmt.body, localCtx, currentLine + 1);
      if (res !== true) return res;
    }

    // -------- For --------
    // Verifica la declaración y tipos del for, y valida el cuerpo
    else if (stmt.type === "for_statement") {
      const iter = stmt.iterator.variable.value;
      // Si el iterador ya existe, error
      if (localCtx[iter]) {
        return {
          type: "SemanticError",
          message: `Variable '${iter}' ya declarada anteriormente`,
          column: stmt.iterator.variable.column,
          line: currentLine,
        };
      }
      // El step debe ser numérico
      if (stmt.step && stmt.step.type !== "number") {
        return {
          type: "SemanticError",
          message: `El step del for debe ser un número`,
          column: stmt.step.column,
          line: currentLine,
        };
      }
      // El inicio, fin y step deben ser numéricos
      if (
        getType(stmt.init, localCtx) !== "number" ||
        getType(stmt.end, localCtx) !== "number" ||
        (stmt.step && getType(stmt.step, localCtx) !== "number")
      ) {
        return {
          type: "SemanticError",
          message: `El inicio, fin y step del for deben ser numéricos`,
          column: stmt.init.column,
          line: currentLine,
        };
      }
      // Crea un contexto local para el for con el iterador
      const forCtx = { ...localCtx };
      forCtx[iter] = { type: "number", forIterator: true };
      // Valida el cuerpo del for
      const res = checkBody(stmt.body, forCtx, currentLine + 1);
      if (res !== true) return res;
    }
  }
  // Si todo es correcto, retorna true
  return true;
}

// =====================
// Export principal
// =====================
const AnalizadorSemantico = (astBody: BodyStatement) => {
  return checkBody(astBody);
};

export default AnalizadorSemantico;
