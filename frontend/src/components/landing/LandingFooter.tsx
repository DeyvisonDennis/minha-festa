import Link from "next/link";
import { Logo } from "./Logo";

export function LandingFooter() {
  return (
    <footer className="footer">
      <div className="lp-container footer-in">
        <Logo />
        <nav aria-label="Legal">
          <Link href="/termos">Termos de uso</Link>
          <Link href="/privacidade">Privacidade</Link>
          <span>© {new Date().getFullYear()} Minha Festa</span>
        </nav>
      </div>
    </footer>
  );
}
