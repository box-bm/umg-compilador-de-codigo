import type { BodyStatement } from "../types/AST";

// Representación simple de una instrucción de código intermedio
type InstruccionIntermedia = string;

/**
 * Genera código intermedio a partir de un AST (BodyStatement)
 * @param ast El árbol de sintaxis abstracta
 * @returns Lista de instrucciones intermedias
 */
export function generarCodigoIntermedio(ast: BodyStatement): InstruccionIntermedia[] {
  const instrucciones: InstruccionIntermedia[] = [];

  function genExpr(expr: any): string {
    if (!expr) return "";
    switch (expr.type) {
      case "number":
      case "string":
      case "boolean":
      case "identifier":
        return expr.value;
      case "binary_expression":
        return `${genExpr(expr.left)} ${expr.operator} ${genExpr(expr.right)}`;
      case "comparison_expression":
        return `${genExpr(expr.left)} ${expr.operator} ${genExpr(expr.right)}`;
      case "logical_operation":
        if (expr.operator === "!") {
          return `!${genExpr(expr.left)}`;
        } else {
          return `${genExpr(expr.left)} ${expr.operator} ${genExpr(expr.right)}`;
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
      case "new_variable_declaration_assignment":
        instrucciones.push(`DECL ${stmt.variable.value}`);
        instrucciones.push(`SET ${stmt.variable.value} = ${genExpr(stmt.value)}`);
        break;
      case "constant_variable_declaration":
        instrucciones.push(`CONST ${stmt.variable.value} = ${genExpr(stmt.value)}`);
        break;
      case "assignment":
        instrucciones.push(`SET ${stmt.variable.value} = ${genExpr(stmt.value)}`);
        break;
      case "print_statement":
        instrucciones.push(`PRINT ${genExpr(stmt.argument)}`);
        break;
      case "binary_expression":
      case "comparison_expression":
      case "logical_operation":
        instrucciones.push(`EXPR ${genExpr(stmt)}`);
        break;
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
        instrucciones.push(`SET ${stmt.iterator.variable.value} = ${genExpr(stmt.init)}`);
        instrucciones.push(`${labelStart}:`);
        instrucciones.push(`IF_FALSE ${stmt.iterator.variable.value} > ${genExpr(stmt.end)} GOTO ${labelEnd}`);
        const bodyInstr = generarCodigoIntermedio(stmt.body);
        instrucciones.push(...bodyInstr);
        if (stmt.step) {
          instrucciones.push(`SET ${stmt.iterator.variable.value} = ${stmt.iterator.variable.value} + ${genExpr(stmt.step)}`);
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
