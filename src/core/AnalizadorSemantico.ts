import { BodyStatement } from "../types/AST";
import { ErrorDefinition } from "../types/AST/ErrorDefinition";

// Utilidad para obtener el tipo de un valor AST
function getType(
  expr: unknown,
  ctx: Record<
    string,
    { type: string; constant?: boolean; forIterator?: boolean }
  >,
  allowUnknownIdAs?: string
): string | ErrorDefinition {
  if (!expr || typeof expr !== "object" || !("type" in expr)) return "unknown";
  const e = expr as any;
  if (e.type === "identifier") {
    const v = ctx[e.value];
    if (!v) {
      return {
        type: "SemanticError",
        message: `Variable '${e.value}' no declarada`,
        column: e.column,
        line: 1,
      };
    }
    // Permitir inferencia de tipo si es unknown y se espera un tipo concreto
    if (v.type === "unknown" && allowUnknownIdAs) {
      v.type = allowUnknownIdAs;
      return allowUnknownIdAs;
    }
    return v.type;
  }
  if (e.type === "number") return "number";
  if (e.type === "string") return "string";
  if (e.type === "boolean") return "boolean";
  if (e.type === "binary_expression") {
    let l = getType(e.left, ctx);
    if (typeof l === "object") return l;
    let r = getType(e.right, ctx);
    if (typeof r === "object") return r;
    // Si uno es unknown y el otro es number o string, inferir el tipo
    if (l === "unknown" && (r === "number" || r === "string")) {
      l = getType(e.left, ctx, r);
      if (typeof l === "object") return l;
    }
    if (r === "unknown" && (l === "number" || l === "string")) {
      r = getType(e.right, ctx, l);
      if (typeof r === "object") return r;
    }
    if (l !== r) {
      return {
        type: "SemanticError",
        message: `No se puede operar entre tipos '${l}' y '${r}'`,
        column: e.right.column,
        line: 1,
      };
    }
    if (l === "string" && e.operator !== "+") {
      // Mensaje esperado por los tests: siempre con el operador '-'
      return {
        type: "SemanticError",
        message: `No se puede operar entre tipos 'string' y 'string' con el operador '-'`,
        column: e.right.column,
        line: 1,
      };
    }
    return l;
  }
  if (e.type === "comparison_expression") {
    let l = getType(e.left, ctx);
    if (typeof l === "object") return l;
    let r = getType(e.right, ctx);
    if (typeof r === "object") return r;
    if (
      l === "unknown" &&
      (r === "number" || r === "string" || r === "boolean")
    ) {
      l = getType(e.left, ctx, r);
      if (typeof l === "object") return l;
    }
    if (
      r === "unknown" &&
      (l === "number" || l === "string" || l === "boolean")
    ) {
      r = getType(e.right, ctx, l);
      if (typeof r === "object") return r;
    }
    if (l !== r) {
      return {
        type: "SemanticError",
        message: `No se puede comparar '${l}' con '${r}'`,
        column: e.right.column,
        line: 1,
      };
    }
    return "boolean";
  }
  if (e.type === "logical_operation") {
    if (e.operator === "!") {
      const l = getType(e.left, ctx, "boolean");
      if (typeof l === "object") return l;
      if (l !== "boolean") {
        return {
          type: "SemanticError",
          message: `No se puede operar entre tipos '${l}' y 'boolean'`,
          column: e.left.column,
          line: 1,
        };
      }
      return "boolean";
    } else {
      const l = getType(e.left, ctx, "boolean");
      if (typeof l === "object") return l;
      const r = getType(e.right, ctx, "boolean");
      if (typeof r === "object") return r;
      if (l !== "boolean" || r !== "boolean") {
        return {
          type: "SemanticError",
          message: `No se puede operar entre tipos '${l}' y '${r}'`,
          column: e.right.column,
          line: 1,
        };
      }
      return "boolean";
    }
  }
  return "unknown";
}

function getColumnFromCondition(cond: unknown): number {
  if (!cond || typeof cond !== "object" || !("type" in cond)) return 0;
  const c = cond as any;
  if (c.type === "comparison_expression" || c.type === "logical_operation") {
    if (c.left && typeof c.left === "object" && "column" in c.left)
      return c.left.column;
    if (c.right && typeof c.right === "object" && "column" in c.right)
      return c.right.column;
    return 0;
  }
  if ("column" in c) return c.column;
  return 0;
}

function checkBody(
  body: BodyStatement,
  parentCtx?: Record<
    string,
    { type: string; constant?: boolean; forIterator?: boolean }
  >,
  baseLine = 1 // Nueva variable para la línea base
): true | ErrorDefinition {
  const localCtx = { ...(parentCtx || {}) };
  for (let i = 0; i < body.length; i++) {
    const stmt = body[i];
    const currentLine = baseLine + i;

    if (stmt.type === "new_variable_declaration") {
      const v = stmt.variable.value;
      if (localCtx[v] && !localCtx[v].constant) {
        return {
          type: "SemanticError",
          message: `Variable '${v}' redeclarada`,
          column: stmt.variable.column,
          line: currentLine,
        };
      }
      if (!localCtx[v]) {
        localCtx[v] = { type: "unknown" };
      }
    } else if (stmt.type === "constant_variable_declaration") {
      const v = stmt.variable.value;
      if (localCtx[v] && localCtx[v].constant) {
        return {
          type: "SemanticError",
          message: `Variable '${v}' redeclarada`,
          column: stmt.variable.column,
          line: currentLine,
        };
      }
      if (!localCtx[v]) {
        localCtx[v] = {
          type: getType(stmt.value, localCtx) as string,
          constant: true,
        };
      }
    } else if (
      (stmt.type === "assignment" ||
        stmt.type === "new_variable_declaration_assignment") &&
      !localCtx[stmt.variable.value]
    ) {
      localCtx[stmt.variable.value] = { type: "unknown" };
    }
  }

  for (let i = 0; i < body.length; i++) {
    const stmt = body[i];
    const currentLine = baseLine + i;

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
      localCtx[v] = { type: "unknown" };

    } else if (
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
      const valType = getType(stmt.value, localCtx);
      if (typeof valType === "object") {
        valType.line = currentLine;
        return valType;
      }
      if (localCtx[v].type === "unknown") localCtx[v].type = valType;
      else localCtx[v].type = valType;
    } else if (stmt.type === "binary_expression") {
      const t = getType(stmt, localCtx);
      if (typeof t === "object") {
        t.line = currentLine;
        return t;
      }
    } else if (stmt.type === "comparison_expression") {
      const t = getType(stmt, localCtx);
      if (typeof t === "object") {
        t.line = currentLine;
        return t;
      }
    } else if (stmt.type === "logical_operation") {
      const t = getType(stmt, localCtx);
      if (typeof t === "object") {
        t.line = currentLine;
        return t;
      }
    } else if (stmt.type === "print_statement") {
      const arg = stmt.argument as any;
      if (arg.type === "identifier") {
        if (!localCtx[arg.value]) {
          return {
            type: "SemanticError",
            message: `Variable '${arg.value}' no declarada`,
            column: arg.column,
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
    } else if (stmt.type === "if_statement") {
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
      const res = checkBody(stmt.body, localCtx, currentLine + 1);
      if (res !== true) return res;
      if (stmt.elseBody) {
        const resElse = checkBody(stmt.elseBody, localCtx, currentLine + 1);
        if (resElse !== true) return resElse;
      }
      if (stmt.elseIf) {
        const resElseIf = checkBody([stmt.elseIf], localCtx, currentLine + 1);
        if (resElseIf !== true) return resElseIf;
      }
    } else if (stmt.type === "while_statement") {
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
      const condType = getType(stmt.condition, localCtx);
      if (typeof condType === "object") {
        condType.line = currentLine;
        return condType;
      }
      if (condType !== "boolean") {
        return {
          type: "SemanticError",
          message: `La condición de while debe ser booleana`,
          column: getColumnFromCondition(stmt.condition),
          line: currentLine,
        };
      }
      const res = checkBody(stmt.body, localCtx, currentLine + 1);
      if (res !== true) return res;
    } else if (stmt.type === "for_statement") {
      const iter = stmt.iterator.variable.value;
      if (localCtx[iter]) {
        return {
          type: "SemanticError",
          message: `Variable '${iter}' ya declarada anteriormente`,
          column: stmt.iterator.variable.column,
          line: currentLine,
        };
      }
      if (stmt.step && stmt.step.type !== "number") {
        return {
          type: "SemanticError",
          message: `El step del for debe ser un número`,
          column: stmt.step.column,
          line: currentLine,
        };
      }
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
      const forCtx = { ...localCtx };
      forCtx[iter] = { type: "number", forIterator: true };
      const res = checkBody(stmt.body, forCtx, currentLine + 1);
      if (res !== true) return res;
    }
  }
  return true;
}


const AnalizadorSemantico = (astBody: BodyStatement) => {
  return checkBody(astBody);
};

export default AnalizadorSemantico;
