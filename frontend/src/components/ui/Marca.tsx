import Image from "next/image";
import Link from "next/link";

// Logo + nome "Minha Festa", usada no aplicativo (Sidebar, login/cadastro,
// onboarding e RSVP). A landing tem a sua própria versão em components/landing/Logo.
// A imagem é a mesma logo da landing, com o fundo transparente e recortada.

const TAMANHOS = {
  sm: { largura: 44, texto: "text-base" },
  md: { largura: 54, texto: "text-lg" },
} as const;

type MarcaProps = {
  tamanho?: keyof typeof TAMANHOS;
  // Quando informado, a marca vira um link (ex.: "/" no login).
  href?: string;
  className?: string;
};

export function Marca({ tamanho = "md", href, className = "" }: MarcaProps) {
  const { largura, texto } = TAMANHOS[tamanho];

  const conteudo = (
    <>
      <Image
        src="/images/logo.png"
        alt=""
        width={largura}
        height={Math.round((largura * 125) / 211)}
        className="shrink-0"
      />
      <span className={`font-serif font-bold text-foreground ${texto}`}>Minha Festa</span>
    </>
  );

  const classes = `flex items-center gap-2 ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} aria-label="Minha Festa — início">
        {conteudo}
      </Link>
    );
  }

  return <div className={classes}>{conteudo}</div>;
}
