"use client";

type TelaErroConexaoProps = {
  mensagem?: string;
  onTentarNovamente: () => void | Promise<void>;
  ocupaTela?: boolean;
};

export function TelaErroConexao({
  mensagem = "Não foi possível conectar ao servidor.",
  onTentarNovamente,
  ocupaTela = true,
}: TelaErroConexaoProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 text-center ${
        ocupaTela ? "min-h-screen bg-[#FAF7F2] px-6" : "py-16"
      }`}
    >
      <p className="text-sm text-muted">{mensagem}</p>
      <button
        onClick={onTentarNovamente}
        className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
      >
        Tentar novamente
      </button>
    </div>
  );
}