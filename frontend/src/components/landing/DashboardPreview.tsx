import { DEMO } from "@/lib/landing-data";
import { Logo } from "./Logo";

// Prévia ilustrativa do produto (dados fictícios).
// NÃO é o painel funcional do usuário.
export function DashboardPreview() {
  return (
    <section id="como-funciona" className="section sand">
      <div className="lp-container">
        <div className="dash-head">
          <p className="eyebrow">
            <span className="rule" />
            Feito para ser leve
          </p>
          <p className="sub left">
            Grandes momentos merecem uma boa organização. Convidados, orçamentos, tarefas,
            cronogramas e todos os detalhes do seu evento reunidos em um só lugar.
          </p>
        </div>
        <div className="dash-scroll">
          <div className="dash" role="img" aria-label="Prévia demonstrativa do painel da plataforma">
            <aside>
              <Logo semLink />
              {DEMO.nav.map((item, i) => (
                <span key={item} className={i === 0 ? "on" : ""}>
                  {item}
                </span>
              ))}
            </aside>
            <div className="dash-main">
              <small className="mono">
                {DEMO.date} · {DEMO.daysLeft}
              </small>
              <h3>{DEMO.event}</h3>
              <div className="stats">
                {DEMO.stats.map(([valor, rotulo]) => (
                  <div key={rotulo}>
                    <strong>{valor}</strong>
                    <span>{rotulo}</span>
                  </div>
                ))}
              </div>
              <div className="steps">
                <h4>Próximos passos</h4>
                {DEMO.tasks.map(([texto, feita]) => (
                  <p key={texto}>
                    <i className={feita ? "done" : ""} />
                    {texto}
                  </p>
                ))}
              </div>
              <small className="demo-note">Dados demonstrativos</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
