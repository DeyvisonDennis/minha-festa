// As datas do app trafegam como texto "AAAA-MM-DD" (dia do calendário, sem hora
// nem fuso). Estas funções centralizam a conversão e a formatação.

function paraData(dataISO: string): Date {
  const [ano, mes, dia] = dataISO.split("-").map(Number);
  return new Date(ano, mes - 1, dia);
}

// Monta "AAAA-MM-DD" a partir de ano, mês (0 a 11, como no Date) e dia.
export function dataLocalISO(ano: number, mes: number, dia: number): string {
  return `${ano}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}

export function hojeISO(): string {
  const hoje = new Date();
  return dataLocalISO(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
}

// Dias até a data. Nunca fica negativo: evento de hoje ou passado retorna 0.
export function calcularDiasRestantes(dataISO: string): number {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const diferenca = paraData(dataISO).getTime() - hoje.getTime();
  return Math.max(0, Math.round(diferenca / (1000 * 60 * 60 * 24)));
}

// "15 de março de 2027"
export function formatarDataExtensa(dataISO: string): string {
  return paraData(dataISO).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// "15 de mar. de 2027"
export function formatarDataResumida(dataISO: string): string {
  return paraData(dataISO).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// "Segunda-feira, 15 de março"
export function formatarDataComSemana(dataISO: string): string {
  const texto = paraData(dataISO).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}