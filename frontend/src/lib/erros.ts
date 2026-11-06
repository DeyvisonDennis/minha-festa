import { ApiError } from "@/lib/api";

export const MENSAGEM_SEM_CONEXAO = "Não foi possível conectar ao servidor. Tente novamente.";

// Texto de erro pronto para o usuário: a mensagem da API quando houver, ou a
// padrão quando o erro não veio do servidor (rede, servidor fora do ar...).
export function mensagemDeErro(err: unknown, padrao: string = MENSAGEM_SEM_CONEXAO): string {
  return err instanceof ApiError ? err.message : padrao;
}