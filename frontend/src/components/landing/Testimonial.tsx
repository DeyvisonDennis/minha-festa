import Image from "next/image";

export function Testimonial() {
  return (
    <section id="historias" className="lp-container section tight">
      <div className="testi">
        <div className="testi-img img-fallback">
          <Image
            src="/images/landing/yasmin.jpg"
            alt="Vitor e Yasmin, clientes da Minha Festa"
            fill
            sizes="(max-width: 900px) 100vw, 480px"
          />
        </div>
        <blockquote>
          <span className="q" aria-hidden="true">
            “
          </span>
          <p className="testi-lead">
            Pela primeira vez, senti que estava aproveitando os preparativos — e não apenas
            correndo atrás deles. 💗
          </p>
          <p className="testi-body">
            A Minha Festa tornou tudo mais simples! Com as funcionalidades organizadas em um só
            lugar, foi fácil acompanhar  {/*o orçamento, gerenciar convidados, encontrar fornecedores */}
            e controlar cada etapa do evento. Uma experiência intuitiva e prática, que trouxe mais
            tranquilidade, organização e tempo para aproveitar cada momento especial.
          </p>
          <footer>
            <strong>Vitor &amp; Yasmin</strong>
            <small className="mono">Casamento • Divinópolis MG</small>
          </footer>
        </blockquote>
      </div>
    </section>
  );
}
