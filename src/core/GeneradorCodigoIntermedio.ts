import type { BodyStatement, BinaryExpression, ComparisonExpression, LogicalOperation } from "../types/AST";

// Representación simple de una instrucción de código intermedio
type InstruccionIntermedia = string;

/**
 * Genera código intermedio a partir de un AST (BodyStatement)
 * @param ast El árbol de sintaxis abstracta
 * @returns Lista de instrucciones intermedias
 */
export function generarCodigoIntermedio(ast: BodyStatement): InstruccionIntermedia[] {
  const instrucciones: InstruccionIntermedia[] = [];
  let tempCount = 0;

  function nuevoTemporal() {
    tempCount++;
    return `t${tempCount}`;
  }

  // Genera código para una expresión y retorna el nombre del temporal/resultante
  function genExpr(expr: unknown): string {
    if (!expr || typeof expr !== "object" || !("type" in expr)) return "";
    const e = expr as { type: string };
    switch (e.type) {
      case "number":
      case "string":
      case "boolean":
      case "identifier":
        return (expr as unknown as { value: string }).value;
      case "binary_expression": {
        const be = expr as BinaryExpression;
        const left = genExpr(be.left);
        const right = genExpr(be.right);
        const temp = nuevoTemporal();
        instrucciones.push(`${temp} = ${left} ${be.operator} ${right}`);
        return temp;
      }
      case "comparison_expression": {
        const ce = expr as ComparisonExpression;
        const left = genExpr(ce.left);
        const right = genExpr(ce.right);
        const temp = nuevoTemporal();
        instrucciones.push(`${temp} = ${left} ${ce.operator} ${right}`);
        return temp;
      }
      case "logical_operation": {
        const lo = expr as LogicalOperation;
        if (lo.operator === "!") {
          const left = genExpr(lo.left);
          const temp = nuevoTemporal();
          instrucciones.push(`${temp} = !${left}`);
          return temp;
        } else {
          const left = genExpr(lo.left);
          const right = genExpr(lo.right);
          const temp = nuevoTemporal();
          instrucciones.push(`${temp} = ${left} ${lo.operator} ${right}`);
          return temp;
        }
      }
      default:
        return "";
    }
  }

  for (const stmt of ast) {
    switch (stmt.type) {
      case "new_variable_declaration":
        instrucciones.push(`DECL ${stmt.variable.value}`);
        break;
      case "new_variable_declaration_assignment": {
        instrucciones.push(`DECL ${stmt.variable.value}`);
        const val = genExpr(stmt.value);
        instrucciones.push(`SET ${stmt.variable.value} = ${val}`);
        break;
      }
      case "constant_variable_declaration": {
        const val = genExpr(stmt.value);
        instrucciones.push(`CONST ${stmt.variable.value} = ${val}`);
        break;
      }
      case "assignment": {
        const val = genExpr(stmt.value);
        instrucciones.push(`SET ${stmt.variable.value} = ${val}`);
        break;
      }
      case "print_statement": {
        const val = genExpr(stmt.argument);
        instrucciones.push(`PRINT ${val}`);
        break;
      }
      case "binary_expression":
      case "comparison_expression":
      case "logical_operation": {
        genExpr(stmt); // Solo para efectos secundarios (instrucciones generadas)
        break;
      }
      case "if_statement": {
        const cond = genExpr(stmt.condition);
        const labelElse = `L${instrucciones.length}_ELSE`;
        const labelEnd = `L${instrucciones.length}_END`;
        instrucciones.push(`IF_FALSE ${cond} GOTO ${labelElse}`);
        const bodyInstr = generarCodigoIntermedio(stmt.body);
        instrucciones.push(...bodyInstr);
        if (stmt.elseIf) {
          instrucciones.push(`GOTO ${labelEnd}`);
          instrucciones.push(`${labelElse}:`);
          const elseIfInstr = generarCodigoIntermedio([stmt.elseIf]);
          instrucciones.push(...elseIfInstr);
          instrucciones.push(`${labelEnd}:`);
        } else if (stmt.elseBody) {
          instrucciones.push(`GOTO ${labelEnd}`);
          instrucciones.push(`${labelElse}:`);
          const elseInstr = generarCodigoIntermedio(stmt.elseBody);
          instrucciones.push(...elseInstr);
          instrucciones.push(`${labelEnd}:`);
        } else {
          instrucciones.push(`${labelElse}:`);
        }
        break;
      }
      case "while_statement": {
        const labelStart = `L${instrucciones.length}_WHILE`;
        const labelEnd = `L${instrucciones.length}_END`;
        instrucciones.push(`${labelStart}:`);
        const cond = genExpr(stmt.condition);
        instrucciones.push(`IF_FALSE ${cond} GOTO ${labelEnd}`);
        const bodyInstr = generarCodigoIntermedio(stmt.body);
        instrucciones.push(...bodyInstr);
        instrucciones.push(`GOTO ${labelStart}`);
        instrucciones.push(`${labelEnd}:`);
        break;
      }
      case "for_statement": {
        const labelStart = `L${instrucciones.length}_FOR`;
        const labelEnd = `L${instrucciones.length}_END`;
        instrucciones.push(`DECL ${stmt.iterator.variable.value}`);
        const initVal = genExpr(stmt.init);
        instrucciones.push(`SET ${stmt.iterator.variable.value} = ${initVal}`);
        instrucciones.push(`${labelStart}:`);
        const endVal = genExpr(stmt.end);
        instrucciones.push(`IF_FALSE ${stmt.iterator.variable.value} > ${endVal} GOTO ${labelEnd}`);
        const bodyInstr = generarCodigoIntermedio(stmt.body);
        instrucciones.push(...bodyInstr);
        if (stmt.step) {
          const stepVal = genExpr(stmt.step);
          instrucciones.push(`SET ${stmt.iterator.variable.value} = ${stmt.iterator.variable.value} + ${stepVal}`);
        } else {
          instrucciones.push(`SET ${stmt.iterator.variable.value} = ${stmt.iterator.variable.value} + 1`);
        }
        instrucciones.push(`GOTO ${labelStart}`);
        instrucciones.push(`${labelEnd}:`);
        break;
      }
      default:
        instrucciones.push(`// No implementado`);
    }
  }

  return instrucciones;
}

export default generarCodigoIntermedio;
