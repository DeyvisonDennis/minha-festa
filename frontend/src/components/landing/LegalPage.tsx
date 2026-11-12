type LegalPageProps = {
  titulo: string;
  atualizadoEm: string;
  conteudo: string;
};

type Bloco =
  | { tipo: "titulo"; texto: string }
  | { tipo: "paragrafo"; texto: string }
  | { tipo: "lista"; itens: string[] };

// Converte o texto simples de legal-content.ts em títulos, parágrafos e listas.
//  - linha que começa com número e ponto ("1. Aceitação...") vira título de seção
//  - linhas que começam com "- " ou "• " viram itens de lista
//  - o resto vira parágrafo
function interpretar(conteudo: string): Bloco[] {
  const blocos: Bloco[] = [];

  for (const trecho of conteudo.split(/\n\s*\n/)) {
    let itens: string[] = [];
    const fecharLista = () => {
      if (itens.length > 0) {
        blocos.push({ tipo: "lista", itens });
        itens = [];
      }
    };

    for (const linha of trecho.split("\n").map((l) => l.trim()).filter(Boolean)) {
      const item = linha.match(/^[-•]\s+(.*)$/);
      if (item) {
        itens.push(item[1]);
        continue;
      }
      fecharLista();
      const ehTitulo = /^\d+\.\s/.test(linha) && linha.length < 80;
      blocos.push(ehTitulo ? { tipo: "titulo", texto: linha } : { tipo: "paragrafo", texto: linha });
    }
    fecharLista();
  }

  return blocos;
}

export function LegalPage({ titulo, atualizadoEm, conteudo }: LegalPageProps) {
  return (
    <section className="page lp-container legal">
      <h1>{titulo}</h1>
      <p className="legal-date">{atualizadoEm}</p>

      {interpretar(conteudo).map((bloco, i) => {
        if (bloco.tipo === "titulo") return <h2 key={i}>{bloco.texto}</h2>;
        if (bloco.tipo === "lista") {
          return (
            <ul key={i}>
              {bloco.itens.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          );
        }
        return <p key={i}>{bloco.texto}</p>;
      })}
    </section>
  );
}
