import { CtaLink } from "./CtaLink";

export function CallToAction() {
  return (
    <section className="lp-container section tight">
      <div className="cta">
        <p className="mono">O seu próximo começa aqui</p>
        <h2>Planeje com calma. Celebre por inteiro.</h2>
        <p>
          Crie seu evento gratuitamente e descubra como organizar pode ser a parte mais gostosa da
          história.
        </p>
        <CtaLink className="btn btn-light">Criar meu evento</CtaLink>
      </div>
    </section>
  );
}
