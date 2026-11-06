"use client";

type AlertaErroProps = {
  children?: React.ReactNode;
  onFechar?: () => void;
  className?: string;
};

// Não renderiza nada quando não há mensagem, então pode ser usado direto: <AlertaErro>{erro}</AlertaErro>
export function AlertaErro({ children, onFechar, className = "" }: AlertaErroProps) {
  if (!children) return null;

  return (
    <div
      role="alert"
      className={`flex items-start justify-between gap-3 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700 ${className}`}
    >
      <p>{children}</p>
      {onFechar && (
        <button
          type="button"
          onClick={onFechar}
          aria-label="Fechar aviso"
          className="cursor-pointer text-red-700/70 hover:text-red-700"
        >
          ✕
        </button>
      )}
    </div>
  );
}