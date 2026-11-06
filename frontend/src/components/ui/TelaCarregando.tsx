type TelaCarregandoProps = {
  mensagem?: string;
  ocupaTela?: boolean;
};

export function TelaCarregando({
  mensagem = "Carregando...",
  ocupaTela = true,
}: TelaCarregandoProps) {
  return (
    <div
      className={`flex items-center justify-center ${
        ocupaTela ? "min-h-screen bg-[#FAF7F2]" : "py-12"
      }`}
    >
      <p className="text-sm text-muted">{mensagem}</p>
    </div>
  );
}