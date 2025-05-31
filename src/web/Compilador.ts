import {
  AnalizadorLexico,
  AnalizadorSemantico,
  AnalizadorSintactico,
} from "../core";
import generarCodigoIntermedio from "../core/GeneradorCodigoIntermedio";
import { type BodyStatement, type ErrorDefinition } from "../types";
import { MostrarError, OcultarErrores } from "./MostrarErrores";

const outputLexico = document.getElementById("output-lexico") as HTMLDivElement;
const outputSintactico = document.getElementById(
  "output-sintactico"
) as HTMLDivElement;

const Compilador = (lineas: string[]): void => {
  outputLexico.innerHTML = "";
  outputSintactico.innerHTML = "";
  OcultarErrores();

  const tokens = [];
  for (const linea of lineas) {
    const lineTokens = AnalizadorLexico(linea);
    tokens.push(lineTokens);
  }
  console.log("Tokens Generados:", tokens);

  outputLexico.innerHTML = `
    <table border="1" cellpadding="4" cellspacing="0">
      <thead>
        <tr>
          <th>Línea</th>
          <th>Columna</th>
          <th>Tipo</th>
          <th>Valor</th>
        </tr>
      </thead>
      <tbody>
        ${tokens
          .map((lineTokens, idx) =>
            lineTokens
              .map(
                (token) =>
                  `<tr>
                      <td>${idx + 1}</td>
                      <td>${token.column}</td>
                      <td>${token.type}</td>
                      <td>${token.value}</td>
                    </tr>`
              )
              .join("")
          )
          .join("")}
      </tbody>
    </table>
  `;

  try {
    // Generamos el arbol de derivacion sintactica y puede devolver error o el arbol
    const ast = AnalizadorSintactico(tokens);
    // En caso de tener errores sintacticos, se lanza una excepcion
    if ("message" in ast && "line" in ast && "column" in ast) {
      throw ast as ErrorDefinition;
    }
    // Si no hay errores, mostramos el arbol de sintaxis
    outputSintactico.innerHTML = `<pre>${JSON.stringify(ast, null, 2)}</pre>`;

    // Generamos el arbol de derivacion semantica y puede devolver error o se completa el proceso
    const revision = AnalizadorSemantico(ast as BodyStatement);
    // En caso de tener errores semanticos, se lanza una excepcion
    if (
      typeof revision === "object" &&
      revision !== null &&
      "message" in revision &&
      "line" in revision &&
      "column" in revision
    ) {
      throw revision as ErrorDefinition;
    }

    const codigoIntermedio = generarCodigoIntermedio(ast);
    console.log("Código Intermedio Generado:", codigoIntermedio);
    
  } catch (error) {
    // Se capturan los errores y se muestran en el output sintactico o semantico
    if (
      typeof error === "object" &&
      error !== null &&
      "message" in error &&
      "line" in error &&
      "column" in error
    ) {
      const errorDef = error as ErrorDefinition;
      MostrarError(errorDef);
    } else {
      MostrarError({
        message: "Error desconocido durante la compilación",
        line: 0,
        column: 0,
      } as ErrorDefinition);
    }
  }
};

export default Compilador;
