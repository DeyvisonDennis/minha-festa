import { Check } from "lucide-react";
import { BENEFICIOS } from "@/lib/landing-data";

export function Benefits() {
  return (
    <section id="recursos" className="section center lp-container">
      <p className="eyebrow c">
        <span className="rule" />
        Tudo o que seu evento precisa
      </p>
      <h2>Seu evento inteiro, em um só lugar.</h2>
      <p className="sub">
        Esqueça planilhas, papéis soltos e grupos de WhatsApp. Orçamento, fornecedores, convidados
        e presentes conectados para você gastar menos energia organizando e mais tempo celebrando.
      </p>

      <div className="cards">
        {BENEFICIOS.map(({ icon: Icone, title, text, featured, points }, i) => (
          <article className={`card ${featured ? "featured" : ""}`} key={title}>
            <header>
              <span className="ico">
                <Icone size={16} />
              </span>
              <span className="num">0{i + 1}</span>
            </header>

            <h3>{title}</h3>
            <p>{text}</p>

            {points && (
              <ul className="points">
                {points.map((ponto) => (
                  <li key={ponto}>
                    <Check size={14} aria-hidden="true" />
                    {ponto}
                  </li>
                ))}
              </ul>
            )}

            <hr />
          </article>
        ))}
      </div>
    </section>
  );
}
