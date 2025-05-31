import type { ErrorDefinition } from "../types";

const errorText = document.getElementById("error-box") as HTMLDivElement | null;
const errorContainer = document.getElementById(
  "error-container"
) as HTMLDivElement | null;

const MostrarError = (error: ErrorDefinition): void => {
  if (!errorContainer || !errorText) return;
  errorContainer.classList.add("error-active");
  const errorElement = document.createElement("div");
  errorElement.className = "error";
  errorElement.innerHTML = `
    <strong>${error.type}</strong>: ${error.message} <br>
    <strong>Línea:</strong> ${error.line} <strong>Columna:</strong> ${error.column}
  `;
  errorText.appendChild(errorElement);
};
const OcultarErrores = (): void => {
  if (!errorContainer || !errorText) return;
  errorContainer.classList.remove("error-active");
  errorText.innerHTML = "";
};

export { MostrarError, OcultarErrores };
