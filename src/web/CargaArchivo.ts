async function CargaArchivo(files: FileList | null): Promise<string> {
  if (files && files.length > 0) {
    const file = files[0];
    if (file.type !== "text/plain") {
      alert("Usa archivos de texto plano. Ejemplo: .txt");
      throw new Error("Invalid file type");
    }
    const text = await file.text();
    return text;
  }
  return "";
}

export default CargaArchivo;
