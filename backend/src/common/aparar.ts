// Remove espaços nas pontas de textos vindos do cliente (usado com @Transform).
export const aparar = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

// Igual ao aparar, mas transforma texto vazio em undefined (campo opcional não preenchido).
export const apararOuUndefined = ({ value }: { value: unknown }) => {
  if (typeof value !== 'string') return value;
  const texto = value.trim();
  return texto === '' ? undefined : texto;
};