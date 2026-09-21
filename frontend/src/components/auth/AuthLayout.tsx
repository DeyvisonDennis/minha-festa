import Image from "next/image";
import Link from "next/link";

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
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/10" />

      <div className="relative z-10 flex min-h-screen items-center px-6 py-12 sm:px-12 lg:px-20">
        <div className="w-full max-w-md rounded-2xl bg-white/95 p-8 shadow-xl backdrop-blur-sm sm:p-10">
          <Link href="/" className="mb-8 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#3d2b1f] text-white">
              ★
            </span>
            <span className="font-serif text-lg font-bold text-foreground">
              Minha Festa
            </span>
          </Link>

          {children}
        </div>
      </div>
    </div>
  );
}