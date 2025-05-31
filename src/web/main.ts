import CargaArchivo from "./CargaArchivo";
import LectorLineas from "./LectorLineas";
import Compilador from "./Compilador";
import { OcultarErrores } from "./MostrarErrores";

const editor = document.getElementById("editor") as HTMLTextAreaElement;
const compilarBtn = document.getElementById("compile-btn") as HTMLButtonElement;
const fileInput = document.getElementById("file-upload") as HTMLInputElement;

fileInput.addEventListener("change", async (event) => {
  const lineas = await CargaArchivo((event.target as HTMLInputElement).files);
  if (lineas) editor.value = lineas;
});

compilarBtn.addEventListener("click", () => {
  const codigo = editor.value;
  const lineas = LectorLineas(codigo);

  Compilador(lineas);
});

OcultarErrores();
