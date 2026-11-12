import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  // Na prévia do painel a logo é só ilustração, não um link.
  semLink?: boolean;
};

export function Logo({ semLink = false }: LogoProps) {
  const conteudo = (
    <>
      <Image
        src="/images/landing/logo.png"
        alt=""
        width={28}
        height={28}
        className="logo-img"
      />
      Minha Festa
    </>
  );

  if (semLink) return <div className="logo">{conteudo}</div>;

  return (
    <Link href="/" className="logo" aria-label="Minha Festa — início">
      {conteudo}
    </Link>
  );
}
