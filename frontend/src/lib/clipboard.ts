// Copia um texto para a área de transferência. Devolve false quando o navegador
// não permite (por exemplo, em páginas sem HTTPS fora do localhost).
export async function copiarTexto(texto: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    return false;
  }
}