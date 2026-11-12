"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { mensagemDeErro } from "@/lib/erros";
import { formatarTelefone } from "@/lib/format";
import { AlertaErro } from "@/components/ui/AlertaErro";
import { AlertaSucesso } from "@/components/ui/AlertaSucesso";
import { EmailAcessoCard } from "@/components/configuracoes/EmailAcessoCard";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { TelaCarregando } from "@/components/ui/TelaCarregando";
import { TelaErroConexao } from "@/components/ui/TelaErroConexao";

type Perfil = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  temSenha: boolean;
  loginGoogle: boolean;
  emailPendente: string | null;
};

const CLASSE_INPUT =
  "mt-1 w-full rounded-lg border border-border px-4 py-2.5 text-sm outline-none focus:border-primary";

export function PerfilForm() {
  const { atualizarUsuario } = useAuth();

  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [erroCarga, setErroCarga] = useState(false);
  const [tentativa, setTentativa] = useState(0);

  // Dados pessoais
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [salvandoDados, setSalvandoDados] = useState(false);
  const [erroDados, setErroDados] = useState<string | null>(null);
  const [okDados, setOkDados] = useState<string | null>(null);

  // Senha
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [salvandoSenha, setSalvandoSenha] = useState(false);
  const [erroSenha, setErroSenha] = useState<string | null>(null);
  const [okSenha, setOkSenha] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;

    async function carregar() {
      try {
        const data = await apiFetch<{ perfil: Perfil }>("/conta/perfil");
        if (cancelado) return;
        setPerfil(data.perfil);
        setNome(data.perfil.nome);
        setTelefone(data.perfil.telefone);
        setErroCarga(false);
      } catch {
        if (!cancelado) setErroCarga(true);
      }
    }

    carregar();
    return () => {
      cancelado = true;
    };
  }, [tentativa]);

  if (erroCarga) {
    return (
      <TelaErroConexao
        ocupaTela={false}
        mensagem="Não foi possível carregar seu perfil."
        onTentarNovamente={() => {
          setErroCarga(false);
          setTentativa((n) => n + 1);
        }}
      />
    );
  }

  if (!perfil) {
    return <TelaCarregando ocupaTela={false} mensagem="Carregando perfil..." />;
  }

  const dadosAlterados = nome.trim() !== perfil.nome || telefone !== perfil.telefone;

  async function salvarDados(e: React.FormEvent) {
    e.preventDefault();
    setErroDados(null);
    setOkDados(null);
    setSalvandoDados(true);

    try {
      const data = await apiFetch<{ perfil: Perfil }>("/conta/perfil", {
        method: "PATCH",
        body: JSON.stringify({ nome, telefone }),
      });
      setPerfil(data.perfil);
      setNome(data.perfil.nome);
      setTelefone(data.perfil.telefone);
      atualizarUsuario({ nome: data.perfil.nome }); // atualiza o nome na Sidebar
      setOkDados("Alterações salvas.");
    } catch (err) {
      setErroDados(mensagemDeErro(err));
    } finally {
      setSalvandoDados(false);
    }
  }

  async function salvarSenha(e: React.FormEvent) {
    e.preventDefault();
    setErroSenha(null);
    setOkSenha(null);

    if (novaSenha.length < 8) {
      setErroSenha("A nova senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (novaSenha !== confirmacao) {
      setErroSenha("A confirmação não confere com a nova senha.");
      return;
    }

    setSalvandoSenha(true);
    try {
      await apiFetch("/auth/senha", {
        method: "PATCH",
        body: JSON.stringify(perfil?.temSenha ? { senhaAtual, novaSenha } : { novaSenha }),
      });
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmacao("");
      setPerfil((p) => (p ? { ...p, temSenha: true } : p));
      setOkSenha("Senha alterada. As sessões em outros dispositivos foram encerradas.");
    } catch (err) {
      setErroSenha(mensagemDeErro(err));
    } finally {
      setSalvandoSenha(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={salvarDados} className="rounded-2xl border border-border bg-white p-6">
        <h2 className="text-base font-semibold text-foreground">Dados pessoais</h2>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="perfil-nome" className="text-sm font-medium text-foreground">
              Nome completo
            </label>
            <input
              id="perfil-nome"
              type="text"
              required
              minLength={3}
              maxLength={150}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className={CLASSE_INPUT}
            />
          </div>

          <div>
            <label htmlFor="perfil-telefone" className="text-sm font-medium text-foreground">
              Telefone
            </label>
            <input
              id="perfil-telefone"
              type="tel"
              value={telefone}
              onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
              placeholder="(11) 99999-0000"
              className={CLASSE_INPUT}
            />
          </div>
        </div>

        <AlertaErro className="mt-5">{erroDados}</AlertaErro>
        <AlertaSucesso className="mt-5">{okDados}</AlertaSucesso>

        <div className="mt-6 flex justify-end border-t border-border pt-5">
          <button
            type="submit"
            disabled={!dadosAlterados || salvandoDados}
            className="cursor-pointer rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {salvandoDados ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </form>

      <EmailAcessoCard
        email={perfil.email}
        emailPendente={perfil.emailPendente}
        temSenha={perfil.temSenha}
        loginGoogle={perfil.loginGoogle}
        onPendenteAlterado={(emailPendente) =>
          setPerfil((p) => (p ? { ...p, emailPendente } : p))
        }
      />

      <form onSubmit={salvarSenha} className="rounded-2xl border border-border bg-white p-6">
        <h2 className="text-base font-semibold text-foreground">
          {perfil.temSenha ? "Alterar senha" : "Criar senha"}
        </h2>

        {perfil.loginGoogle && perfil.temSenha && (
          <p className="mt-3 rounded-lg bg-[#FAF7F2] px-4 py-3 text-xs text-muted">
            Você entra com o Google? Se nunca criou uma senha para esta conta, use{" "}
            <Link href="/esqueci-senha" className="font-medium text-foreground underline">
              Esqueci minha senha
            </Link>{" "}
            para definir uma.
          </p>
        )}

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {perfil.temSenha && (
            <div className="sm:col-span-2">
              <label htmlFor="senha-atual" className="text-sm font-medium text-foreground">
                Senha atual
              </label>
              <PasswordInput id="senha-atual" value={senhaAtual} onChange={setSenhaAtual} required />
            </div>
          )}
          <div>
            <label htmlFor="senha-nova" className="text-sm font-medium text-foreground">
              Nova senha
            </label>
            <PasswordInput
              id="senha-nova"
              value={novaSenha}
              onChange={setNovaSenha}
              placeholder="Mínimo de 8 caracteres"
              required
              minLength={8}
            />
          </div>
          <div>
            <label htmlFor="senha-confirmacao" className="text-sm font-medium text-foreground">
              Confirmar nova senha
            </label>
            <PasswordInput
              id="senha-confirmacao"
              value={confirmacao}
              onChange={setConfirmacao}
              required
              minLength={8}
            />
          </div>
        </div>

        <p className="mt-3 text-xs text-muted">
          Ao trocar a senha, você continua conectado aqui e é desconectado dos outros dispositivos.
        </p>

        <AlertaErro className="mt-5">{erroSenha}</AlertaErro>
        <AlertaSucesso className="mt-5">{okSenha}</AlertaSucesso>

        <div className="mt-6 flex justify-end border-t border-border pt-5">
          <button
            type="submit"
            disabled={salvandoSenha || !novaSenha || !confirmacao}
            className="cursor-pointer rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {salvandoSenha ? "Salvando..." : perfil.temSenha ? "Alterar senha" : "Criar senha"}
          </button>
        </div>
      </form>
    </div>
  );
}