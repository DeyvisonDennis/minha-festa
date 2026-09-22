"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type Usuario = {
  id: string;
  nome: string;
  email: string;
  perfil: string;
  ativo: boolean;
};

type AuthContextType = {
  usuario: Usuario | null;
  carregando: boolean;
  recarregar: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  const carregarUsuario = useCallback(async () => {
    try {
      const data = await apiFetch<{ usuario: Usuario }>("/auth/me");
      setUsuario(data.usuario);
    } catch {
      setUsuario(null);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    let cancelado = false;

    async function carregarInicial() {
      try {
        const data = await apiFetch<{ usuario: Usuario }>("/auth/me");
        if (!cancelado) setUsuario(data.usuario);
      } catch {
        if (!cancelado) setUsuario(null);
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }

    carregarInicial();

    return () => {
      cancelado = true;
    };
  }, []);

  const router = useRouter();

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
      value={{ usuario, carregando, recarregar: carregarUsuario, logout }}
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