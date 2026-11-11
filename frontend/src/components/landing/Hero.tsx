import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Gift, Layers } from "lucide-react";
import { CtaLink } from "./CtaLink";

export function Hero() {
  return (
    <section className="hero lp-container">
      <div className="hero-text">
        <p className="eyebrow">
          <span className="rule" />
          Seu evento, finalmente organizado
        </p>
        <h1>
          Planeje cada detalhe. <em>Viva cada momento.</em>
        </h1>
        <p className="lead">
          Tudo o que você precisa para transformar ideias em celebrações inesquecíveis — em uma
          plataforma cuidadosa, sem estresse e com muito mais presença.
        </p>
        <div className="actions">
          <CtaLink className="btn btn-dark">
            Começar a planejar <ArrowRight size={14} />
          </CtaLink>
          <Link href="/#como-funciona" className="link-sec">
            Conhecer a plataforma
          </Link>
        </div>
        <ul className="perks">
          <li>
            <Layers size={14} />
            Tudo em um só lugar
          </li>
          <li>
            <Clock size={14} />
            Configure em 3 minutos
          </li>
          <li>
            <Gift size={14} />
            Sem taxa de criação
          </li>
        </ul>
      </div>
      <figure className="hero-img img-fallback">
        <Image
          src="/images/landing/hero-mesa.jpg"
          alt="Mesa de evento posta com flores, frutas e iguarias ao ar livre"
          fill
          sizes="(max-width: 900px) 100vw, 560px"
          preload
        />
        <figcaption>
          <small>Planeje com calma. Celebre por inteiro.</small>
          <span>Organizar também pode ser especial.</span>
        </figcaption>
      </figure>
    </section>
  );
}
