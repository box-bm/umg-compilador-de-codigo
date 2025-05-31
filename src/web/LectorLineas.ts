function LectorLineas(text: string): string[] {
  const lines = text.split("\n");
  console.log("LectorLineas", lines);
  return lines;
}

export default LectorLineas;
