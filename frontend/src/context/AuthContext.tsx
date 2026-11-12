"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { ApiError, apiFetch } from "@/lib/api";

type Usuario = {
  id: string;
  nome: string;
  email: string;
  perfil: string;
  ativo: boolean;
};

type ResultadoSessao =
  | { tipo: "logado"; usuario: Usuario }
  | { tipo: "deslogado" }
  | { tipo: "erro" };

// Só 401/403 significam "não está logado". Qualquer outra falha (servidor
// fora do ar, erro 500, rede) NÃO pode ser tratada como logout.
async function consultarSessao(): Promise<ResultadoSessao> {
  try {
    const data = await apiFetch<{ usuario: Usuario }>("/auth/me");
    return { tipo: "logado", usuario: data.usuario };
  } catch (err) {
    if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
      return { tipo: "deslogado" };
    }
    return { tipo: "erro" };
  }
}

type AuthContextType = {
  usuario: Usuario | null;
  carregando: boolean;
  erroConexao: boolean;
  recarregar: () => Promise<void>;
  atualizarUsuario: (dados: Partial<Pick<Usuario, "nome">>) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erroConexao, setErroConexao] = useState(false);

  useEffect(() => {
    let cancelado = false;

    async function carregarInicial() {
      const resultado = await consultarSessao();
      if (cancelado) return;

      if (resultado.tipo === "logado") setUsuario(resultado.usuario);
      if (resultado.tipo === "deslogado") setUsuario(null);
      setErroConexao(resultado.tipo === "erro");
      setCarregando(false);
    }

    carregarInicial();

    return () => {
      cancelado = true;
    };
  }, []);

  const recarregar = useCallback(async () => {
    setCarregando(true);
    const resultado = await consultarSessao();

    if (resultado.tipo === "logado") setUsuario(resultado.usuario);
    if (resultado.tipo === "deslogado") setUsuario(null);
    setErroConexao(resultado.tipo === "erro");
    setCarregando(false);
  }, []);

  // Atualiza os dados em memória depois de salvar o perfil, sem recarregar a sessão
  // (recarregar mostraria a tela de "Carregando..." no meio da página).
  const atualizarUsuario = useCallback((dados: Partial<Pick<Usuario, "nome">>) => {
    setUsuario((atual) => (atual ? { ...atual, ...dados } : atual));
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } finally {
      setUsuario(null);
      router.push("/login");
    }
  }, [router]);

  return (
    <AuthContext.Provider
      value={{ usuario, carregando, erroConexao, recarregar, atualizarUsuario, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth precisa ser usado dentro de <AuthProvider>");
  }
  return ctx;
}