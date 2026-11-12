"use client";

type AlertaSucessoProps = {
  children?: React.ReactNode;
  className?: string;
};

// Par do AlertaErro para confirmações ("Alterações salvas."). Sem mensagem, não renderiza nada.
export function AlertaSucesso({ children, className = "" }: AlertaSucessoProps) {
  if (!children) return null;

  return (
    <p
      role="status"
      className={`rounded-lg bg-green-50 px-4 py-2.5 text-sm text-green-700 ${className}`}
    >
      {children}
    </p>
  );
}