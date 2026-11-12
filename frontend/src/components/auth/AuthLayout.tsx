import Image from "next/image";
import { Marca } from "@/components/ui/Marca";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <Image
        src="/images/banner-auth.png"
        alt=""
        fill
        preload
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/10" />

      <div className="relative z-10 flex min-h-screen items-center px-6 py-12 sm:px-12 lg:px-20">
        <div className="w-full max-w-md rounded-2xl bg-white/95 p-8 shadow-xl backdrop-blur-sm sm:p-10">
          <Marca href="/" className="mb-8 w-fit" />

          {children}
        </div>
      </div>
    </div>
  );
}