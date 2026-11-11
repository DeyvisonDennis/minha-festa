import { Cormorant_Garamond, Lato } from "next/font/google";

// Fontes próprias da landing (o aplicativo usa Lora e Inter).
// O next/font baixa as fontes na hora do build e as serve do próprio site:
// nenhum visitante faz requisição ao Google.
export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
  display: "swap",
});
