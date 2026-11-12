import type { Metadata, Viewport } from "next";
import { Benefits } from "@/components/landing/Benefits";
import { CallToAction } from "@/components/landing/CallToAction";
import { CategoryNavigation } from "@/components/landing/CategoryNavigation";
import { DashboardPreview } from "@/components/landing/DashboardPreview";
import { Hero } from "@/components/landing/Hero";
import { LandingShell } from "@/components/landing/LandingShell";
import { Testimonial } from "@/components/landing/Testimonial";

export const metadata: Metadata = {
  title: "Minha Festa • Viva cada momento",
  description:
    "Organize seu evento em um só lugar: cronograma, convidados e tarefas, sem estresse.",
  openGraph: {
    title: "Minha Festa • Viva cada momento",
    description:
      "Organize seu evento em um só lugar: cronograma, convidados e tarefas, sem estresse.",
    locale: "pt_BR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#F9F6F2",
};

export default function HomePage() {
  return (
    <LandingShell>
      <Hero />
      <CategoryNavigation />
      <Benefits />
      <DashboardPreview />
      <Testimonial />
      <CallToAction />
    </LandingShell>
  );
}
