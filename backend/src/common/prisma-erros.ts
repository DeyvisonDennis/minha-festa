// Erro P2002 do Prisma: violação de restrição única (e-mail repetido, etc.).
export function violouUnicidade(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'P2002'
  );
}

// Nome do campo que causou a violação, quando o Prisma informa.
export function campoDaViolacao(error: unknown): string {
  if (typeof error !== 'object' || error === null || !('meta' in error)) {
    return 'campo';
  }
  const meta = error.meta as { target?: unknown } | undefined;
  const alvo = meta?.target;
  if (Array.isArray(alvo) && typeof alvo[0] === 'string') return alvo[0];
  if (typeof alvo === 'string') return alvo;
  return 'campo';
}