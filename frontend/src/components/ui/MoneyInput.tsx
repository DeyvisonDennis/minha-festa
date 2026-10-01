"use client";

function formatarInteiroBR(digitos: string): string {
  if (!digitos) return "";
  const numero = parseInt(digitos, 10);
  return numero.toLocaleString("pt-BR");
}

type MoneyInputProps = {
  id?: string;
  value: number | undefined;
  onChange: (valor: number | undefined) => void;
  placeholder?: string;
};

export function MoneyInput({ id, value, onChange, placeholder }: MoneyInputProps) {
  const texto = value !== undefined ? formatarInteiroBR(String(Math.round(value))) : "";

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digitos = e.target.value.replace(/\D/g, "");

    if (!digitos) {
      onChange(undefined);
      return;
    }

    onChange(parseInt(digitos, 10));
  }

  return (
    <div className="relative mt-1">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted">
        R$
      </span>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        value={texto}
        onChange={handleChange}
        placeholder={placeholder ?? "0"}
        className="w-full rounded-lg border border-border py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}