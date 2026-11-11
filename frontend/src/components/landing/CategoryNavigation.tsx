import Link from "next/link";
import { CATEGORIAS } from "@/lib/landing-data";

export function CategoryNavigation() {
  return (
    <nav className="cats" aria-label="Categorias de eventos">
      <ul className="lp-container">
        <li className="cats-label">Feito para celebrar</li>
        {CATEGORIAS.map(([texto, tipo]) => (
          <li key={tipo}>
            <Link href={`/cadastro?tipo=${tipo}`}>{texto}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
