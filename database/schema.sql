--
-- PostgreSQL database dump
--

\restrict WbVYsYvirIalD4qKVBK12YK6mrYHKC0MaZPSz5yXCXUGjJAKPKgJmv0O2RXJtjw

-- Dumped from database version 17.8
-- Dumped by pg_dump version 18.2

-- Started on 2026-09-22 22:25:28

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 16646)
-- Name: citext; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;


--
-- TOC entry 5477 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION citext; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';


--
-- TOC entry 3 (class 3079 OID 16751)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 5478 (class 0 OID 0)
-- Dependencies: 3
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- TOC entry 962 (class 1247 OID 16789)
-- Name: perfil_usuario; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.perfil_usuario AS ENUM (
    'ORGANIZADOR',
    'FORNECEDOR',
    'ADMINISTRADOR'
);


ALTER TYPE public.perfil_usuario OWNER TO postgres;

--
-- TOC entry 965 (class 1247 OID 16796)
-- Name: status_assinatura; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.status_assinatura AS ENUM (
    'PENDENTE',
    'ATIVA',
    'ATRASADA',
    'CANCELADA',
    'EXPIRADA'
);


ALTER TYPE public.status_assinatura OWNER TO postgres;

--
-- TOC entry 968 (class 1247 OID 16808)
-- Name: status_contribuicao; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.status_contribuicao AS ENUM (
    'PENDENTE',
    'PAGA',
    'CANCELADA',
    'ESTORNADA'
);


ALTER TYPE public.status_contribuicao OWNER TO postgres;

--
-- TOC entry 971 (class 1247 OID 16818)
-- Name: status_fornecedor; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.status_fornecedor AS ENUM (
    'PENDENTE',
    'APROVADO',
    'BLOQUEADO',
    'OCULTO'
);


ALTER TYPE public.status_fornecedor OWNER TO postgres;

--
-- TOC entry 974 (class 1247 OID 16828)
-- Name: status_orcamento; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.status_orcamento AS ENUM (
    'SOLICITADO',
    'RECEBIDO',
    'EM_ANALISE',
    'APROVADO',
    'RECUSADO',
    'CANCELADO'
);


ALTER TYPE public.status_orcamento OWNER TO postgres;

--
-- TOC entry 977 (class 1247 OID 16842)
-- Name: status_pagamento; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.status_pagamento AS ENUM (
    'PENDENTE',
    'APROVADO',
    'RECUSADO',
    'CANCELADO',
    'ESTORNADO'
);


ALTER TYPE public.status_pagamento OWNER TO postgres;

--
-- TOC entry 980 (class 1247 OID 16854)
-- Name: status_rsvp; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.status_rsvp AS ENUM (
    'CONFIRMADO',
    'NAO_CONFIRMADO',
    'PENDENTE'
);


ALTER TYPE public.status_rsvp OWNER TO postgres;

--
-- TOC entry 983 (class 1247 OID 16862)
-- Name: status_solicitacao_lgpd; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.status_solicitacao_lgpd AS ENUM (
    'ABERTA',
    'EM_ANALISE',
    'ATENDIDA',
    'RECUSADA',
    'CANCELADA'
);


ALTER TYPE public.status_solicitacao_lgpd OWNER TO postgres;

--
-- TOC entry 986 (class 1247 OID 16874)
-- Name: status_tarefa; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.status_tarefa AS ENUM (
    'PENDENTE',
    'EM_ANDAMENTO',
    'CONCLUIDA',
    'CANCELADA'
);


ALTER TYPE public.status_tarefa OWNER TO postgres;

--
-- TOC entry 989 (class 1247 OID 16884)
-- Name: tipo_consentimento; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tipo_consentimento AS ENUM (
    'TERMOS_DE_USO',
    'POLITICA_DE_PRIVACIDADE',
    'COMUNICACOES'
);


ALTER TYPE public.tipo_consentimento OWNER TO postgres;

--
-- TOC entry 992 (class 1247 OID 16892)
-- Name: tipo_presente; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tipo_presente AS ENUM (
    'PRODUTO',
    'CONTRIBUICAO_PIX'
);


ALTER TYPE public.tipo_presente OWNER TO postgres;

--
-- TOC entry 995 (class 1247 OID 16898)
-- Name: tipo_solicitacao_lgpd; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tipo_solicitacao_lgpd AS ENUM (
    'EXCLUSAO',
    'EXPORTACAO',
    'CORRECAO',
    'INFORMACOES'
);


ALTER TYPE public.tipo_solicitacao_lgpd OWNER TO postgres;

--
-- TOC entry 262 (class 1255 OID 16907)
-- Name: atualizar_media_fornecedor(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.atualizar_media_fornecedor() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE fornecedores
    SET
        avaliacao_media = (
            SELECT COALESCE(AVG(nota), 0)
            FROM avaliacoes_fornecedores
            WHERE fornecedor_id = COALESCE(NEW.fornecedor_id, OLD.fornecedor_id)
        ),
        quantidade_avaliacoes = (
            SELECT COUNT(*)
            FROM avaliacoes_fornecedores
            WHERE fornecedor_id = COALESCE(NEW.fornecedor_id, OLD.fornecedor_id)
        )
    WHERE id = COALESCE(NEW.fornecedor_id, OLD.fornecedor_id);

    RETURN COALESCE(NEW, OLD);
END;
$$;


ALTER FUNCTION public.atualizar_media_fornecedor() OWNER TO postgres;

--
-- TOC entry 280 (class 1255 OID 16908)
-- Name: atualizar_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.atualizar_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.atualizar_updated_at() OWNER TO postgres;

--
-- TOC entry 325 (class 1255 OID 16909)
-- Name: fornecedor_pode_aparecer_vitrine(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fornecedor_pode_aparecer_vitrine(p_fornecedor_id uuid) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
    pode_aparecer BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM fornecedores f
        INNER JOIN assinaturas_fornecedor a
            ON a.fornecedor_id = f.id
        WHERE f.id = p_fornecedor_id
          AND f.status = 'APROVADO'
          AND f.perfil_validado = TRUE
          AND a.status = 'ATIVA'
          AND (
              a.fim_em IS NULL
              OR a.fim_em >= CURRENT_DATE
          )
    )
    INTO pode_aparecer;

    RETURN pode_aparecer;
END;
$$;


ALTER FUNCTION public.fornecedor_pode_aparecer_vitrine(p_fornecedor_id uuid) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 16910)
-- Name: assinaturas_fornecedor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assinaturas_fornecedor (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    fornecedor_id uuid NOT NULL,
    valor_mensal numeric(10,2) DEFAULT 5.00 NOT NULL,
    status public.status_assinatura DEFAULT 'PENDENTE'::public.status_assinatura NOT NULL,
    inicio_em date,
    fim_em date,
    proxima_cobranca date,
    cancelada_em timestamp with time zone,
    gateway character varying(50),
    gateway_assinatura_id character varying(150),
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_assinatura_periodo CHECK (((fim_em IS NULL) OR (inicio_em IS NULL) OR (fim_em >= inicio_em))),
    CONSTRAINT chk_assinatura_valor CHECK ((valor_mensal >= (0)::numeric))
);


ALTER TABLE public.assinaturas_fornecedor OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16920)
-- Name: avaliacoes_fornecedores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.avaliacoes_fornecedores (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    fornecedor_id uuid NOT NULL,
    evento_id uuid NOT NULL,
    organizador_id uuid NOT NULL,
    nota integer NOT NULL,
    comentario text,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_avaliacao_nota CHECK (((nota >= 1) AND (nota <= 5)))
);


ALTER TABLE public.avaliacoes_fornecedores OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16928)
-- Name: blocos_site_evento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.blocos_site_evento (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    site_id uuid NOT NULL,
    tipo_bloco character varying(50) NOT NULL,
    titulo character varying(180),
    conteudo jsonb DEFAULT '{}'::jsonb NOT NULL,
    ordem integer DEFAULT 0 NOT NULL,
    visivel boolean DEFAULT true NOT NULL,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.blocos_site_evento OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16939)
-- Name: categorias_fornecedores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categorias_fornecedores (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nome character varying(100) NOT NULL,
    descricao text,
    ativa boolean DEFAULT true NOT NULL,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.categorias_fornecedores OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16948)
-- Name: consentimentos_lgpd; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.consentimentos_lgpd (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    usuario_id uuid NOT NULL,
    tipo public.tipo_consentimento NOT NULL,
    versao_documento character varying(30) NOT NULL,
    aceito boolean NOT NULL,
    ip_origem inet,
    aceito_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.consentimentos_lgpd OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16955)
-- Name: contribuicoes_presentes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contribuicoes_presentes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    presente_id uuid NOT NULL,
    nome_contribuinte character varying(150),
    email_contribuinte public.citext,
    valor numeric(12,2) NOT NULL,
    status public.status_contribuicao DEFAULT 'PENDENTE'::public.status_contribuicao NOT NULL,
    gateway character varying(50),
    gateway_pagamento_id character varying(150),
    pago_em timestamp with time zone,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_contribuicao_valor CHECK ((valor > (0)::numeric))
);


ALTER TABLE public.contribuicoes_presentes OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16964)
-- Name: convidados; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.convidados (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    evento_id uuid NOT NULL,
    nome character varying(150) NOT NULL,
    telefone character varying(20),
    email public.citext,
    grupo character varying(100),
    observacao text,
    qr_code_token uuid DEFAULT gen_random_uuid() NOT NULL,
    status_rsvp public.status_rsvp DEFAULT 'PENDENTE'::public.status_rsvp NOT NULL,
    respondeu_em timestamp with time zone,
    check_in boolean DEFAULT false NOT NULL,
    check_in_em timestamp with time zone,
    convite_enviado_em timestamp with time zone,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.convidados OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16975)
-- Name: convites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.convites (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    evento_id uuid NOT NULL,
    nome character varying(150) NOT NULL,
    template character varying(100) NOT NULL,
    json_layout jsonb DEFAULT '{}'::jsonb NOT NULL,
    cores jsonb DEFAULT '{}'::jsonb NOT NULL,
    fontes jsonb DEFAULT '{}'::jsonb NOT NULL,
    fotos jsonb DEFAULT '[]'::jsonb NOT NULL,
    pdf_url text,
    png_url text,
    link_publico text,
    publicado boolean DEFAULT false NOT NULL,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.convites OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16988)
-- Name: eventos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.eventos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organizador_id uuid NOT NULL,
    nome_evento character varying(180) NOT NULL,
    tipo_evento character varying(100),
    data_evento date NOT NULL,
    hora_evento time without time zone,
    local character varying(255),
    endereco text,
    cidade character varying(100),
    estado character(2),
    descricao text,
    historia text,
    imagem_capa_url text,
    orcamento_total numeric(12,2) DEFAULT 0 NOT NULL,
    publico boolean DEFAULT false NOT NULL,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_evento_estado CHECK (((estado IS NULL) OR (estado ~ '^[A-Z]{2}$'::text))),
    CONSTRAINT chk_evento_orcamento CHECK ((orcamento_total >= (0)::numeric))
);


ALTER TABLE public.eventos OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 17000)
-- Name: fornecedores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fornecedores (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    usuario_id uuid NOT NULL,
    categoria_id uuid NOT NULL,
    nome_empresa character varying(180) NOT NULL,
    cnpj character varying(14) NOT NULL,
    descricao text,
    telefone character varying(20),
    email public.citext,
    site character varying(255),
    instagram character varying(150),
    facebook character varying(150),
    cidade character varying(100) NOT NULL,
    estado character(2) NOT NULL,
    endereco text,
    status public.status_fornecedor DEFAULT 'PENDENTE'::public.status_fornecedor NOT NULL,
    perfil_validado boolean DEFAULT false NOT NULL,
    validado_por uuid,
    validado_em timestamp with time zone,
    bloqueado_em timestamp with time zone,
    motivo_bloqueio text,
    avaliacao_media numeric(3,2) DEFAULT 0 NOT NULL,
    quantidade_avaliacoes integer DEFAULT 0 NOT NULL,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_fornecedor_avaliacao CHECK (((avaliacao_media >= (0)::numeric) AND (avaliacao_media <= (5)::numeric))),
    CONSTRAINT chk_fornecedor_cnpj CHECK (((cnpj)::text ~ '^[0-9]{14}$'::text)),
    CONSTRAINT chk_fornecedor_estado CHECK ((estado ~ '^[A-Z]{2}$'::text))
);


ALTER TABLE public.fornecedores OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 17015)
-- Name: logs_auditoria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.logs_auditoria (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    usuario_id uuid,
    acao character varying(100) NOT NULL,
    tabela_afetada character varying(100),
    registro_id uuid,
    dados_anteriores jsonb,
    dados_novos jsonb,
    ip_origem inet,
    user_agent text,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.logs_auditoria OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 17022)
-- Name: notificacoes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notificacoes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    usuario_id uuid NOT NULL,
    titulo character varying(180) NOT NULL,
    mensagem text NOT NULL,
    tipo character varying(80),
    lida boolean DEFAULT false NOT NULL,
    lida_em timestamp with time zone,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.notificacoes OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 17030)
-- Name: orcamentos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orcamentos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    evento_id uuid NOT NULL,
    fornecedor_id uuid,
    categoria_id uuid,
    categoria_nome character varying(120),
    valor numeric(12,2) NOT NULL,
    observacao text,
    validade date,
    status public.status_orcamento DEFAULT 'SOLICITADO'::public.status_orcamento NOT NULL,
    contratado boolean DEFAULT false NOT NULL,
    data_contratacao date,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_orcamento_valor CHECK ((valor >= (0)::numeric))
);


ALTER TABLE public.orcamentos OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 17041)
-- Name: orcamentos_categorias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orcamentos_categorias (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    evento_id uuid NOT NULL,
    categoria_id uuid,
    nome_categoria character varying(120) NOT NULL,
    valor_planejado numeric(12,2) DEFAULT 0 NOT NULL,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_orcamento_categoria_valor CHECK ((valor_planejado >= (0)::numeric))
);


ALTER TABLE public.orcamentos_categorias OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 17049)
-- Name: pagamentos_fornecedor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pagamentos_fornecedor (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    fornecedor_id uuid NOT NULL,
    assinatura_id uuid,
    valor numeric(10,2) NOT NULL,
    vencimento date NOT NULL,
    pago_em timestamp with time zone,
    status public.status_pagamento DEFAULT 'PENDENTE'::public.status_pagamento NOT NULL,
    gateway character varying(50),
    gateway_pagamento_id character varying(150),
    comprovante_url text,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_pagamento_valor CHECK ((valor > (0)::numeric))
);


ALTER TABLE public.pagamentos_fornecedor OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 17059)
-- Name: pix_configuracoes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pix_configuracoes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    evento_id uuid NOT NULL,
    chave_pix character varying(255) NOT NULL,
    banco character varying(120),
    favorecido character varying(150) NOT NULL,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.pix_configuracoes OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 17067)
-- Name: portfolio_fornecedor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.portfolio_fornecedor (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    fornecedor_id uuid NOT NULL,
    imagem_url text NOT NULL,
    titulo character varying(150),
    descricao text,
    ordem integer DEFAULT 0 NOT NULL,
    destaque boolean DEFAULT false NOT NULL,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.portfolio_fornecedor OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 17076)
-- Name: presentes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.presentes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    evento_id uuid NOT NULL,
    nome character varying(180) NOT NULL,
    descricao text,
    imagem_url text,
    valor numeric(12,2) DEFAULT 0 NOT NULL,
    link_compra text,
    tipo public.tipo_presente NOT NULL,
    quantidade integer DEFAULT 1 NOT NULL,
    recebido boolean DEFAULT false NOT NULL,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_presente_quantidade CHECK ((quantidade > 0)),
    CONSTRAINT chk_presente_tipo CHECK ((((tipo = 'PRODUTO'::public.tipo_presente) AND (link_compra IS NOT NULL)) OR (tipo = 'CONTRIBUICAO_PIX'::public.tipo_presente))),
    CONSTRAINT chk_presente_valor CHECK ((valor >= (0)::numeric))
);


ALTER TABLE public.presentes OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 17090)
-- Name: save_the_date; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.save_the_date (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    evento_id uuid NOT NULL,
    nome character varying(150) NOT NULL,
    template character varying(100) NOT NULL,
    json_layout jsonb DEFAULT '{}'::jsonb NOT NULL,
    imagem_url text,
    pdf_url text,
    link_publico text,
    publicado boolean DEFAULT false NOT NULL,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.save_the_date OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 17100)
-- Name: sessoes_usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessoes_usuario (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    usuario_id uuid NOT NULL,
    refresh_token_hash character varying(255) NOT NULL,
    ip_origem inet,
    user_agent text,
    expira_em timestamp with time zone NOT NULL,
    revogada_em timestamp with time zone,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.sessoes_usuario OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 17107)
-- Name: sites_evento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sites_evento (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    evento_id uuid NOT NULL,
    slug character varying(180) NOT NULL,
    tema character varying(100),
    titulo character varying(180),
    descricao text,
    publicado boolean DEFAULT false NOT NULL,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.sites_evento OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 17116)
-- Name: solicitacoes_lgpd; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.solicitacoes_lgpd (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    usuario_id uuid NOT NULL,
    tipo public.tipo_solicitacao_lgpd NOT NULL,
    status public.status_solicitacao_lgpd DEFAULT 'ABERTA'::public.status_solicitacao_lgpd NOT NULL,
    descricao text,
    resposta text,
    atendido_por uuid,
    atendida_em timestamp with time zone,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.solicitacoes_lgpd OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 17125)
-- Name: tarefas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tarefas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    evento_id uuid NOT NULL,
    titulo character varying(180) NOT NULL,
    descricao text,
    responsavel_id uuid,
    prazo date,
    hora_prazo time without time zone,
    status public.status_tarefa DEFAULT 'PENDENTE'::public.status_tarefa NOT NULL,
    prioridade integer DEFAULT 0 NOT NULL,
    concluida_em timestamp with time zone,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.tarefas OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 17135)
-- Name: tokens_confirmacao_email; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tokens_confirmacao_email (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    usuario_id uuid NOT NULL,
    token_hash character varying(255) NOT NULL,
    expira_em timestamp with time zone NOT NULL,
    utilizado_em timestamp with time zone,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.tokens_confirmacao_email OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 17140)
-- Name: tokens_recuperacao_senha; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tokens_recuperacao_senha (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    usuario_id uuid NOT NULL,
    token_hash character varying(255) NOT NULL,
    expira_em timestamp with time zone NOT NULL,
    utilizado_em timestamp with time zone,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.tokens_recuperacao_senha OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 17145)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nome character varying(150) NOT NULL,
    cpf character varying(11),
    email public.citext NOT NULL,
    senha_hash character varying(255),
    telefone character varying(20),
    perfil public.perfil_usuario DEFAULT 'ORGANIZADOR'::public.perfil_usuario NOT NULL,
    email_confirmado boolean DEFAULT false NOT NULL,
    ativo boolean DEFAULT true NOT NULL,
    consentimento_lgpd boolean DEFAULT false NOT NULL,
    data_consentimento_lgpd timestamp with time zone,
    ultimo_login timestamp with time zone,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    excluido_em timestamp with time zone,
    google_id character varying(255),
    CONSTRAINT chk_usuario_cpf CHECK (((cpf IS NULL) OR ((cpf)::text ~ '^[0-9]{11}$'::text))),
    CONSTRAINT chk_usuario_nome CHECK ((length(TRIM(BOTH FROM nome)) >= 3))
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 17159)
-- Name: vw_dashboard_evento; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vw_dashboard_evento AS
 SELECT e.id AS evento_id,
    e.nome_evento,
    e.data_evento,
    count(DISTINCT c.id) AS total_convidados,
    count(DISTINCT c.id) FILTER (WHERE (c.status_rsvp = 'CONFIRMADO'::public.status_rsvp)) AS convidados_confirmados,
    count(DISTINCT c.id) FILTER (WHERE (c.status_rsvp = 'NAO_CONFIRMADO'::public.status_rsvp)) AS convidados_nao_confirmados,
    count(DISTINCT c.id) FILTER (WHERE (c.status_rsvp = 'PENDENTE'::public.status_rsvp)) AS convidados_pendentes,
    count(DISTINCT t.id) FILTER (WHERE (t.status = ANY (ARRAY['PENDENTE'::public.status_tarefa, 'EM_ANDAMENTO'::public.status_tarefa]))) AS tarefas_pendentes,
    count(DISTINCT t.id) FILTER (WHERE ((t.prazo IS NOT NULL) AND ((t.prazo >= CURRENT_DATE) AND (t.prazo <= (CURRENT_DATE + '30 days'::interval))))) AS tarefas_proximas
   FROM ((public.eventos e
     LEFT JOIN public.convidados c ON ((c.evento_id = e.id)))
     LEFT JOIN public.tarefas t ON ((t.evento_id = e.id)))
  GROUP BY e.id, e.nome_evento, e.data_evento;


ALTER VIEW public.vw_dashboard_evento OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 17164)
-- Name: vw_resumo_financeiro_evento; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vw_resumo_financeiro_evento AS
 SELECT e.id AS evento_id,
    e.nome_evento,
    e.orcamento_total,
    (COALESCE(sum(
        CASE
            WHEN (o.contratado = true) THEN o.valor
            ELSE (0)::numeric
        END), (0)::numeric))::numeric(12,2) AS valor_contratado,
    ((e.orcamento_total - COALESCE(sum(
        CASE
            WHEN (o.contratado = true) THEN o.valor
            ELSE (0)::numeric
        END), (0)::numeric)))::numeric(12,2) AS valor_restante,
        CASE
            WHEN (e.orcamento_total > (0)::numeric) THEN round(((COALESCE(sum(
            CASE
                WHEN (o.contratado = true) THEN o.valor
                ELSE (0)::numeric
            END), (0)::numeric) / e.orcamento_total) * (100)::numeric), 2)
            ELSE (0)::numeric
        END AS percentual_utilizado
   FROM (public.eventos e
     LEFT JOIN public.orcamentos o ON ((o.evento_id = e.id)))
  GROUP BY e.id, e.nome_evento, e.orcamento_total;


ALTER VIEW public.vw_resumo_financeiro_evento OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 17169)
-- Name: vw_vitrine_fornecedores; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vw_vitrine_fornecedores AS
 SELECT f.id,
    f.nome_empresa,
    c.nome AS categoria,
    f.descricao,
    f.telefone,
    f.email,
    f.site,
    f.instagram,
    f.facebook,
    f.cidade,
    f.estado,
    f.avaliacao_media,
    f.quantidade_avaliacoes
   FROM (public.fornecedores f
     JOIN public.categorias_fornecedores c ON ((c.id = f.categoria_id)))
  WHERE ((f.status = 'APROVADO'::public.status_fornecedor) AND (f.perfil_validado = true) AND (EXISTS ( SELECT 1
           FROM public.assinaturas_fornecedor a
          WHERE ((a.fornecedor_id = f.id) AND (a.status = 'ATIVA'::public.status_assinatura) AND ((a.fim_em IS NULL) OR (a.fim_em >= CURRENT_DATE))))));


ALTER VIEW public.vw_vitrine_fornecedores OWNER TO postgres;

--
-- TOC entry 5147 (class 2606 OID 17175)
-- Name: assinaturas_fornecedor assinaturas_fornecedor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assinaturas_fornecedor
    ADD CONSTRAINT assinaturas_fornecedor_pkey PRIMARY KEY (id);


--
-- TOC entry 5152 (class 2606 OID 17177)
-- Name: avaliacoes_fornecedores avaliacoes_fornecedores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.avaliacoes_fornecedores
    ADD CONSTRAINT avaliacoes_fornecedores_pkey PRIMARY KEY (id);


--
-- TOC entry 5157 (class 2606 OID 17179)
-- Name: blocos_site_evento blocos_site_evento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blocos_site_evento
    ADD CONSTRAINT blocos_site_evento_pkey PRIMARY KEY (id);


--
-- TOC entry 5160 (class 2606 OID 17181)
-- Name: categorias_fornecedores categorias_fornecedores_nome_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias_fornecedores
    ADD CONSTRAINT categorias_fornecedores_nome_key UNIQUE (nome);


--
-- TOC entry 5162 (class 2606 OID 17183)
-- Name: categorias_fornecedores categorias_fornecedores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias_fornecedores
    ADD CONSTRAINT categorias_fornecedores_pkey PRIMARY KEY (id);


--
-- TOC entry 5164 (class 2606 OID 17185)
-- Name: consentimentos_lgpd consentimentos_lgpd_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consentimentos_lgpd
    ADD CONSTRAINT consentimentos_lgpd_pkey PRIMARY KEY (id);


--
-- TOC entry 5167 (class 2606 OID 17187)
-- Name: contribuicoes_presentes contribuicoes_presentes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contribuicoes_presentes
    ADD CONSTRAINT contribuicoes_presentes_pkey PRIMARY KEY (id);


--
-- TOC entry 5171 (class 2606 OID 17189)
-- Name: convidados convidados_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.convidados
    ADD CONSTRAINT convidados_pkey PRIMARY KEY (id);


--
-- TOC entry 5173 (class 2606 OID 17191)
-- Name: convidados convidados_qr_code_token_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.convidados
    ADD CONSTRAINT convidados_qr_code_token_key UNIQUE (qr_code_token);


--
-- TOC entry 5178 (class 2606 OID 17193)
-- Name: convites convites_link_publico_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.convites
    ADD CONSTRAINT convites_link_publico_key UNIQUE (link_publico);


--
-- TOC entry 5180 (class 2606 OID 17195)
-- Name: convites convites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.convites
    ADD CONSTRAINT convites_pkey PRIMARY KEY (id);


--
-- TOC entry 5183 (class 2606 OID 17197)
-- Name: eventos eventos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.eventos
    ADD CONSTRAINT eventos_pkey PRIMARY KEY (id);


--
-- TOC entry 5187 (class 2606 OID 17199)
-- Name: fornecedores fornecedores_cnpj_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fornecedores
    ADD CONSTRAINT fornecedores_cnpj_key UNIQUE (cnpj);


--
-- TOC entry 5189 (class 2606 OID 17201)
-- Name: fornecedores fornecedores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fornecedores
    ADD CONSTRAINT fornecedores_pkey PRIMARY KEY (id);


--
-- TOC entry 5191 (class 2606 OID 17203)
-- Name: fornecedores fornecedores_usuario_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fornecedores
    ADD CONSTRAINT fornecedores_usuario_id_key UNIQUE (usuario_id);


--
-- TOC entry 5200 (class 2606 OID 17205)
-- Name: logs_auditoria logs_auditoria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logs_auditoria
    ADD CONSTRAINT logs_auditoria_pkey PRIMARY KEY (id);


--
-- TOC entry 5203 (class 2606 OID 17207)
-- Name: notificacoes notificacoes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificacoes
    ADD CONSTRAINT notificacoes_pkey PRIMARY KEY (id);


--
-- TOC entry 5211 (class 2606 OID 17209)
-- Name: orcamentos_categorias orcamentos_categorias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orcamentos_categorias
    ADD CONSTRAINT orcamentos_categorias_pkey PRIMARY KEY (id);


--
-- TOC entry 5208 (class 2606 OID 17211)
-- Name: orcamentos orcamentos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orcamentos
    ADD CONSTRAINT orcamentos_pkey PRIMARY KEY (id);


--
-- TOC entry 5217 (class 2606 OID 17213)
-- Name: pagamentos_fornecedor pagamentos_fornecedor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagamentos_fornecedor
    ADD CONSTRAINT pagamentos_fornecedor_pkey PRIMARY KEY (id);


--
-- TOC entry 5219 (class 2606 OID 17215)
-- Name: pix_configuracoes pix_configuracoes_evento_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pix_configuracoes
    ADD CONSTRAINT pix_configuracoes_evento_id_key UNIQUE (evento_id);


--
-- TOC entry 5221 (class 2606 OID 17217)
-- Name: pix_configuracoes pix_configuracoes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pix_configuracoes
    ADD CONSTRAINT pix_configuracoes_pkey PRIMARY KEY (id);


--
-- TOC entry 5224 (class 2606 OID 17219)
-- Name: portfolio_fornecedor portfolio_fornecedor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolio_fornecedor
    ADD CONSTRAINT portfolio_fornecedor_pkey PRIMARY KEY (id);


--
-- TOC entry 5227 (class 2606 OID 17221)
-- Name: presentes presentes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.presentes
    ADD CONSTRAINT presentes_pkey PRIMARY KEY (id);


--
-- TOC entry 5230 (class 2606 OID 17223)
-- Name: save_the_date save_the_date_link_publico_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.save_the_date
    ADD CONSTRAINT save_the_date_link_publico_key UNIQUE (link_publico);


--
-- TOC entry 5232 (class 2606 OID 17225)
-- Name: save_the_date save_the_date_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.save_the_date
    ADD CONSTRAINT save_the_date_pkey PRIMARY KEY (id);


--
-- TOC entry 5234 (class 2606 OID 17227)
-- Name: sessoes_usuario sessoes_usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessoes_usuario
    ADD CONSTRAINT sessoes_usuario_pkey PRIMARY KEY (id);


--
-- TOC entry 5236 (class 2606 OID 17229)
-- Name: sessoes_usuario sessoes_usuario_refresh_token_hash_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessoes_usuario
    ADD CONSTRAINT sessoes_usuario_refresh_token_hash_key UNIQUE (refresh_token_hash);


--
-- TOC entry 5239 (class 2606 OID 17231)
-- Name: sites_evento sites_evento_evento_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sites_evento
    ADD CONSTRAINT sites_evento_evento_id_key UNIQUE (evento_id);


--
-- TOC entry 5241 (class 2606 OID 17233)
-- Name: sites_evento sites_evento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sites_evento
    ADD CONSTRAINT sites_evento_pkey PRIMARY KEY (id);


--
-- TOC entry 5243 (class 2606 OID 17235)
-- Name: sites_evento sites_evento_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sites_evento
    ADD CONSTRAINT sites_evento_slug_key UNIQUE (slug);


--
-- TOC entry 5247 (class 2606 OID 17237)
-- Name: solicitacoes_lgpd solicitacoes_lgpd_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitacoes_lgpd
    ADD CONSTRAINT solicitacoes_lgpd_pkey PRIMARY KEY (id);


--
-- TOC entry 5252 (class 2606 OID 17239)
-- Name: tarefas tarefas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tarefas
    ADD CONSTRAINT tarefas_pkey PRIMARY KEY (id);


--
-- TOC entry 5255 (class 2606 OID 17241)
-- Name: tokens_confirmacao_email tokens_confirmacao_email_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tokens_confirmacao_email
    ADD CONSTRAINT tokens_confirmacao_email_pkey PRIMARY KEY (id);


--
-- TOC entry 5257 (class 2606 OID 17243)
-- Name: tokens_confirmacao_email tokens_confirmacao_email_token_hash_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tokens_confirmacao_email
    ADD CONSTRAINT tokens_confirmacao_email_token_hash_key UNIQUE (token_hash);


--
-- TOC entry 5259 (class 2606 OID 17245)
-- Name: tokens_recuperacao_senha tokens_recuperacao_senha_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tokens_recuperacao_senha
    ADD CONSTRAINT tokens_recuperacao_senha_pkey PRIMARY KEY (id);


--
-- TOC entry 5261 (class 2606 OID 17247)
-- Name: tokens_recuperacao_senha tokens_recuperacao_senha_token_hash_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tokens_recuperacao_senha
    ADD CONSTRAINT tokens_recuperacao_senha_token_hash_key UNIQUE (token_hash);


--
-- TOC entry 5155 (class 2606 OID 17249)
-- Name: avaliacoes_fornecedores uq_avaliacao_evento_fornecedor; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.avaliacoes_fornecedores
    ADD CONSTRAINT uq_avaliacao_evento_fornecedor UNIQUE (evento_id, fornecedor_id);


--
-- TOC entry 5213 (class 2606 OID 17251)
-- Name: orcamentos_categorias uq_evento_categoria_orcamento; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orcamentos_categorias
    ADD CONSTRAINT uq_evento_categoria_orcamento UNIQUE (evento_id, nome_categoria);


--
-- TOC entry 5265 (class 2606 OID 17253)
-- Name: usuarios usuarios_cpf_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_cpf_key UNIQUE (cpf);


--
-- TOC entry 5267 (class 2606 OID 17255)
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- TOC entry 5269 (class 2606 OID 17488)
-- Name: usuarios usuarios_google_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_google_id_key UNIQUE (google_id);


--
-- TOC entry 5271 (class 2606 OID 17257)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- TOC entry 5148 (class 1259 OID 17258)
-- Name: idx_assinaturas_fornecedor; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_assinaturas_fornecedor ON public.assinaturas_fornecedor USING btree (fornecedor_id);


--
-- TOC entry 5149 (class 1259 OID 17259)
-- Name: idx_assinaturas_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_assinaturas_status ON public.assinaturas_fornecedor USING btree (status);


--
-- TOC entry 5153 (class 1259 OID 17260)
-- Name: idx_avaliacoes_fornecedor; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_avaliacoes_fornecedor ON public.avaliacoes_fornecedores USING btree (fornecedor_id);


--
-- TOC entry 5158 (class 1259 OID 17261)
-- Name: idx_blocos_site; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_blocos_site ON public.blocos_site_evento USING btree (site_id, ordem);


--
-- TOC entry 5165 (class 1259 OID 17262)
-- Name: idx_consentimentos_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_consentimentos_usuario ON public.consentimentos_lgpd USING btree (usuario_id);


--
-- TOC entry 5168 (class 1259 OID 17263)
-- Name: idx_contribuicoes_presente; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contribuicoes_presente ON public.contribuicoes_presentes USING btree (presente_id);


--
-- TOC entry 5169 (class 1259 OID 17264)
-- Name: idx_contribuicoes_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contribuicoes_status ON public.contribuicoes_presentes USING btree (status);


--
-- TOC entry 5174 (class 1259 OID 17265)
-- Name: idx_convidados_evento; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_convidados_evento ON public.convidados USING btree (evento_id);


--
-- TOC entry 5175 (class 1259 OID 17266)
-- Name: idx_convidados_rsvp; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_convidados_rsvp ON public.convidados USING btree (status_rsvp);


--
-- TOC entry 5181 (class 1259 OID 17267)
-- Name: idx_convites_evento; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_convites_evento ON public.convites USING btree (evento_id);


--
-- TOC entry 5184 (class 1259 OID 17268)
-- Name: idx_eventos_data; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_eventos_data ON public.eventos USING btree (data_evento);


--
-- TOC entry 5185 (class 1259 OID 17269)
-- Name: idx_eventos_organizador; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_eventos_organizador ON public.eventos USING btree (organizador_id);


--
-- TOC entry 5192 (class 1259 OID 17270)
-- Name: idx_fornecedores_avaliacao; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fornecedores_avaliacao ON public.fornecedores USING btree (avaliacao_media DESC);


--
-- TOC entry 5193 (class 1259 OID 17271)
-- Name: idx_fornecedores_categoria; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fornecedores_categoria ON public.fornecedores USING btree (categoria_id);


--
-- TOC entry 5194 (class 1259 OID 17272)
-- Name: idx_fornecedores_localizacao; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fornecedores_localizacao ON public.fornecedores USING btree (cidade, estado);


--
-- TOC entry 5195 (class 1259 OID 17273)
-- Name: idx_fornecedores_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fornecedores_status ON public.fornecedores USING btree (status);


--
-- TOC entry 5196 (class 1259 OID 17274)
-- Name: idx_logs_data; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_logs_data ON public.logs_auditoria USING btree (criado_em);


--
-- TOC entry 5197 (class 1259 OID 17275)
-- Name: idx_logs_tabela_registro; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_logs_tabela_registro ON public.logs_auditoria USING btree (tabela_afetada, registro_id);


--
-- TOC entry 5198 (class 1259 OID 17276)
-- Name: idx_logs_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_logs_usuario ON public.logs_auditoria USING btree (usuario_id);


--
-- TOC entry 5201 (class 1259 OID 17277)
-- Name: idx_notificacoes_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notificacoes_usuario ON public.notificacoes USING btree (usuario_id, lida);


--
-- TOC entry 5209 (class 1259 OID 17278)
-- Name: idx_orcamentos_categorias_evento; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_orcamentos_categorias_evento ON public.orcamentos_categorias USING btree (evento_id);


--
-- TOC entry 5204 (class 1259 OID 17279)
-- Name: idx_orcamentos_evento; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_orcamentos_evento ON public.orcamentos USING btree (evento_id);


--
-- TOC entry 5205 (class 1259 OID 17280)
-- Name: idx_orcamentos_fornecedor; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_orcamentos_fornecedor ON public.orcamentos USING btree (fornecedor_id);


--
-- TOC entry 5206 (class 1259 OID 17281)
-- Name: idx_orcamentos_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_orcamentos_status ON public.orcamentos USING btree (status);


--
-- TOC entry 5214 (class 1259 OID 17282)
-- Name: idx_pagamentos_fornecedor; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pagamentos_fornecedor ON public.pagamentos_fornecedor USING btree (fornecedor_id);


--
-- TOC entry 5215 (class 1259 OID 17283)
-- Name: idx_pagamentos_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pagamentos_status ON public.pagamentos_fornecedor USING btree (status);


--
-- TOC entry 5222 (class 1259 OID 17284)
-- Name: idx_portfolio_fornecedor; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_portfolio_fornecedor ON public.portfolio_fornecedor USING btree (fornecedor_id);


--
-- TOC entry 5225 (class 1259 OID 17285)
-- Name: idx_presentes_evento; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_presentes_evento ON public.presentes USING btree (evento_id);


--
-- TOC entry 5228 (class 1259 OID 17286)
-- Name: idx_save_the_date_evento; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_save_the_date_evento ON public.save_the_date USING btree (evento_id);


--
-- TOC entry 5237 (class 1259 OID 17287)
-- Name: idx_sites_evento_slug; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sites_evento_slug ON public.sites_evento USING btree (slug);


--
-- TOC entry 5244 (class 1259 OID 17288)
-- Name: idx_solicitacoes_lgpd_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_solicitacoes_lgpd_status ON public.solicitacoes_lgpd USING btree (status);


--
-- TOC entry 5245 (class 1259 OID 17289)
-- Name: idx_solicitacoes_lgpd_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_solicitacoes_lgpd_usuario ON public.solicitacoes_lgpd USING btree (usuario_id);


--
-- TOC entry 5248 (class 1259 OID 17290)
-- Name: idx_tarefas_evento; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tarefas_evento ON public.tarefas USING btree (evento_id);


--
-- TOC entry 5249 (class 1259 OID 17291)
-- Name: idx_tarefas_prazo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tarefas_prazo ON public.tarefas USING btree (prazo);


--
-- TOC entry 5250 (class 1259 OID 17292)
-- Name: idx_tarefas_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tarefas_status ON public.tarefas USING btree (status);


--
-- TOC entry 5253 (class 1259 OID 17293)
-- Name: idx_tokens_email_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tokens_email_usuario ON public.tokens_confirmacao_email USING btree (usuario_id);


--
-- TOC entry 5262 (class 1259 OID 17294)
-- Name: idx_usuarios_email_confirmado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuarios_email_confirmado ON public.usuarios USING btree (email_confirmado);


--
-- TOC entry 5263 (class 1259 OID 17295)
-- Name: idx_usuarios_perfil; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuarios_perfil ON public.usuarios USING btree (perfil);


--
-- TOC entry 5150 (class 1259 OID 17296)
-- Name: uq_assinatura_ativa_fornecedor; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uq_assinatura_ativa_fornecedor ON public.assinaturas_fornecedor USING btree (fornecedor_id) WHERE (status = ANY (ARRAY['ATIVA'::public.status_assinatura, 'PENDENTE'::public.status_assinatura]));


--
-- TOC entry 5176 (class 1259 OID 17297)
-- Name: uq_convidado_email_evento; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uq_convidado_email_evento ON public.convidados USING btree (evento_id, email) WHERE (email IS NOT NULL);


--
-- TOC entry 5306 (class 2620 OID 17298)
-- Name: assinaturas_fornecedor trg_assinaturas_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_assinaturas_updated_at BEFORE UPDATE ON public.assinaturas_fornecedor FOR EACH ROW EXECUTE FUNCTION public.atualizar_updated_at();


--
-- TOC entry 5307 (class 2620 OID 17299)
-- Name: avaliacoes_fornecedores trg_atualizar_media_fornecedor; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_atualizar_media_fornecedor AFTER INSERT OR DELETE OR UPDATE ON public.avaliacoes_fornecedores FOR EACH ROW EXECUTE FUNCTION public.atualizar_media_fornecedor();


--
-- TOC entry 5308 (class 2620 OID 17300)
-- Name: blocos_site_evento trg_blocos_site_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_blocos_site_updated_at BEFORE UPDATE ON public.blocos_site_evento FOR EACH ROW EXECUTE FUNCTION public.atualizar_updated_at();


--
-- TOC entry 5309 (class 2620 OID 17301)
-- Name: categorias_fornecedores trg_categorias_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_categorias_updated_at BEFORE UPDATE ON public.categorias_fornecedores FOR EACH ROW EXECUTE FUNCTION public.atualizar_updated_at();


--
-- TOC entry 5310 (class 2620 OID 17302)
-- Name: convidados trg_convidados_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_convidados_updated_at BEFORE UPDATE ON public.convidados FOR EACH ROW EXECUTE FUNCTION public.atualizar_updated_at();


--
-- TOC entry 5311 (class 2620 OID 17303)
-- Name: convites trg_convites_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_convites_updated_at BEFORE UPDATE ON public.convites FOR EACH ROW EXECUTE FUNCTION public.atualizar_updated_at();


--
-- TOC entry 5312 (class 2620 OID 17304)
-- Name: eventos trg_eventos_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_eventos_updated_at BEFORE UPDATE ON public.eventos FOR EACH ROW EXECUTE FUNCTION public.atualizar_updated_at();


--
-- TOC entry 5313 (class 2620 OID 17305)
-- Name: fornecedores trg_fornecedores_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_fornecedores_updated_at BEFORE UPDATE ON public.fornecedores FOR EACH ROW EXECUTE FUNCTION public.atualizar_updated_at();


--
-- TOC entry 5315 (class 2620 OID 17306)
-- Name: orcamentos_categorias trg_orcamentos_categorias_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_orcamentos_categorias_updated_at BEFORE UPDATE ON public.orcamentos_categorias FOR EACH ROW EXECUTE FUNCTION public.atualizar_updated_at();


--
-- TOC entry 5314 (class 2620 OID 17307)
-- Name: orcamentos trg_orcamentos_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_orcamentos_updated_at BEFORE UPDATE ON public.orcamentos FOR EACH ROW EXECUTE FUNCTION public.atualizar_updated_at();


--
-- TOC entry 5316 (class 2620 OID 17308)
-- Name: pagamentos_fornecedor trg_pagamentos_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_pagamentos_updated_at BEFORE UPDATE ON public.pagamentos_fornecedor FOR EACH ROW EXECUTE FUNCTION public.atualizar_updated_at();


--
-- TOC entry 5317 (class 2620 OID 17309)
-- Name: pix_configuracoes trg_pix_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_pix_updated_at BEFORE UPDATE ON public.pix_configuracoes FOR EACH ROW EXECUTE FUNCTION public.atualizar_updated_at();


--
-- TOC entry 5318 (class 2620 OID 17310)
-- Name: presentes trg_presentes_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_presentes_updated_at BEFORE UPDATE ON public.presentes FOR EACH ROW EXECUTE FUNCTION public.atualizar_updated_at();


--
-- TOC entry 5319 (class 2620 OID 17311)
-- Name: save_the_date trg_save_the_date_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_save_the_date_updated_at BEFORE UPDATE ON public.save_the_date FOR EACH ROW EXECUTE FUNCTION public.atualizar_updated_at();


--
-- TOC entry 5320 (class 2620 OID 17312)
-- Name: sites_evento trg_sites_evento_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_sites_evento_updated_at BEFORE UPDATE ON public.sites_evento FOR EACH ROW EXECUTE FUNCTION public.atualizar_updated_at();


--
-- TOC entry 5321 (class 2620 OID 17313)
-- Name: solicitacoes_lgpd trg_solicitacoes_lgpd_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_solicitacoes_lgpd_updated_at BEFORE UPDATE ON public.solicitacoes_lgpd FOR EACH ROW EXECUTE FUNCTION public.atualizar_updated_at();


--
-- TOC entry 5322 (class 2620 OID 17314)
-- Name: tarefas trg_tarefas_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_tarefas_updated_at BEFORE UPDATE ON public.tarefas FOR EACH ROW EXECUTE FUNCTION public.atualizar_updated_at();


--
-- TOC entry 5323 (class 2620 OID 17315)
-- Name: usuarios trg_usuarios_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_usuarios_updated_at BEFORE UPDATE ON public.usuarios FOR EACH ROW EXECUTE FUNCTION public.atualizar_updated_at();


--
-- TOC entry 5272 (class 2606 OID 17316)
-- Name: assinaturas_fornecedor assinaturas_fornecedor_fornecedor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assinaturas_fornecedor
    ADD CONSTRAINT assinaturas_fornecedor_fornecedor_id_fkey FOREIGN KEY (fornecedor_id) REFERENCES public.fornecedores(id) ON DELETE CASCADE;


--
-- TOC entry 5273 (class 2606 OID 17321)
-- Name: avaliacoes_fornecedores avaliacoes_fornecedores_evento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.avaliacoes_fornecedores
    ADD CONSTRAINT avaliacoes_fornecedores_evento_id_fkey FOREIGN KEY (evento_id) REFERENCES public.eventos(id) ON DELETE CASCADE;


--
-- TOC entry 5274 (class 2606 OID 17326)
-- Name: avaliacoes_fornecedores avaliacoes_fornecedores_fornecedor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.avaliacoes_fornecedores
    ADD CONSTRAINT avaliacoes_fornecedores_fornecedor_id_fkey FOREIGN KEY (fornecedor_id) REFERENCES public.fornecedores(id) ON DELETE CASCADE;


--
-- TOC entry 5275 (class 2606 OID 17331)
-- Name: avaliacoes_fornecedores avaliacoes_fornecedores_organizador_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.avaliacoes_fornecedores
    ADD CONSTRAINT avaliacoes_fornecedores_organizador_id_fkey FOREIGN KEY (organizador_id) REFERENCES public.usuarios(id) ON DELETE RESTRICT;


--
-- TOC entry 5276 (class 2606 OID 17336)
-- Name: blocos_site_evento blocos_site_evento_site_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blocos_site_evento
    ADD CONSTRAINT blocos_site_evento_site_id_fkey FOREIGN KEY (site_id) REFERENCES public.sites_evento(id) ON DELETE CASCADE;


--
-- TOC entry 5277 (class 2606 OID 17341)
-- Name: consentimentos_lgpd consentimentos_lgpd_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consentimentos_lgpd
    ADD CONSTRAINT consentimentos_lgpd_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 5278 (class 2606 OID 17346)
-- Name: contribuicoes_presentes contribuicoes_presentes_presente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contribuicoes_presentes
    ADD CONSTRAINT contribuicoes_presentes_presente_id_fkey FOREIGN KEY (presente_id) REFERENCES public.presentes(id) ON DELETE CASCADE;


--
-- TOC entry 5279 (class 2606 OID 17351)
-- Name: convidados convidados_evento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.convidados
    ADD CONSTRAINT convidados_evento_id_fkey FOREIGN KEY (evento_id) REFERENCES public.eventos(id) ON DELETE CASCADE;


--
-- TOC entry 5280 (class 2606 OID 17356)
-- Name: convites convites_evento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.convites
    ADD CONSTRAINT convites_evento_id_fkey FOREIGN KEY (evento_id) REFERENCES public.eventos(id) ON DELETE CASCADE;


--
-- TOC entry 5281 (class 2606 OID 17361)
-- Name: eventos eventos_organizador_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.eventos
    ADD CONSTRAINT eventos_organizador_id_fkey FOREIGN KEY (organizador_id) REFERENCES public.usuarios(id) ON DELETE RESTRICT;


--
-- TOC entry 5282 (class 2606 OID 17366)
-- Name: fornecedores fornecedores_categoria_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fornecedores
    ADD CONSTRAINT fornecedores_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES public.categorias_fornecedores(id) ON DELETE RESTRICT;


--
-- TOC entry 5283 (class 2606 OID 17371)
-- Name: fornecedores fornecedores_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fornecedores
    ADD CONSTRAINT fornecedores_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE RESTRICT;


--
-- TOC entry 5284 (class 2606 OID 17376)
-- Name: fornecedores fornecedores_validado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fornecedores
    ADD CONSTRAINT fornecedores_validado_por_fkey FOREIGN KEY (validado_por) REFERENCES public.usuarios(id) ON DELETE SET NULL;


--
-- TOC entry 5285 (class 2606 OID 17381)
-- Name: logs_auditoria logs_auditoria_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logs_auditoria
    ADD CONSTRAINT logs_auditoria_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE SET NULL;


--
-- TOC entry 5286 (class 2606 OID 17386)
-- Name: notificacoes notificacoes_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificacoes
    ADD CONSTRAINT notificacoes_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 5287 (class 2606 OID 17391)
-- Name: orcamentos orcamentos_categoria_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orcamentos
    ADD CONSTRAINT orcamentos_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES public.categorias_fornecedores(id) ON DELETE SET NULL;


--
-- TOC entry 5290 (class 2606 OID 17396)
-- Name: orcamentos_categorias orcamentos_categorias_categoria_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orcamentos_categorias
    ADD CONSTRAINT orcamentos_categorias_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES public.categorias_fornecedores(id) ON DELETE SET NULL;


--
-- TOC entry 5291 (class 2606 OID 17401)
-- Name: orcamentos_categorias orcamentos_categorias_evento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orcamentos_categorias
    ADD CONSTRAINT orcamentos_categorias_evento_id_fkey FOREIGN KEY (evento_id) REFERENCES public.eventos(id) ON DELETE CASCADE;


--
-- TOC entry 5288 (class 2606 OID 17406)
-- Name: orcamentos orcamentos_evento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orcamentos
    ADD CONSTRAINT orcamentos_evento_id_fkey FOREIGN KEY (evento_id) REFERENCES public.eventos(id) ON DELETE CASCADE;


--
-- TOC entry 5289 (class 2606 OID 17411)
-- Name: orcamentos orcamentos_fornecedor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orcamentos
    ADD CONSTRAINT orcamentos_fornecedor_id_fkey FOREIGN KEY (fornecedor_id) REFERENCES public.fornecedores(id) ON DELETE SET NULL;


--
-- TOC entry 5292 (class 2606 OID 17416)
-- Name: pagamentos_fornecedor pagamentos_fornecedor_assinatura_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagamentos_fornecedor
    ADD CONSTRAINT pagamentos_fornecedor_assinatura_id_fkey FOREIGN KEY (assinatura_id) REFERENCES public.assinaturas_fornecedor(id) ON DELETE SET NULL;


--
-- TOC entry 5293 (class 2606 OID 17421)
-- Name: pagamentos_fornecedor pagamentos_fornecedor_fornecedor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagamentos_fornecedor
    ADD CONSTRAINT pagamentos_fornecedor_fornecedor_id_fkey FOREIGN KEY (fornecedor_id) REFERENCES public.fornecedores(id) ON DELETE RESTRICT;


--
-- TOC entry 5294 (class 2606 OID 17426)
-- Name: pix_configuracoes pix_configuracoes_evento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pix_configuracoes
    ADD CONSTRAINT pix_configuracoes_evento_id_fkey FOREIGN KEY (evento_id) REFERENCES public.eventos(id) ON DELETE CASCADE;


--
-- TOC entry 5295 (class 2606 OID 17431)
-- Name: portfolio_fornecedor portfolio_fornecedor_fornecedor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolio_fornecedor
    ADD CONSTRAINT portfolio_fornecedor_fornecedor_id_fkey FOREIGN KEY (fornecedor_id) REFERENCES public.fornecedores(id) ON DELETE CASCADE;


--
-- TOC entry 5296 (class 2606 OID 17436)
-- Name: presentes presentes_evento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.presentes
    ADD CONSTRAINT presentes_evento_id_fkey FOREIGN KEY (evento_id) REFERENCES public.eventos(id) ON DELETE CASCADE;


--
-- TOC entry 5297 (class 2606 OID 17441)
-- Name: save_the_date save_the_date_evento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.save_the_date
    ADD CONSTRAINT save_the_date_evento_id_fkey FOREIGN KEY (evento_id) REFERENCES public.eventos(id) ON DELETE CASCADE;


--
-- TOC entry 5298 (class 2606 OID 17446)
-- Name: sessoes_usuario sessoes_usuario_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessoes_usuario
    ADD CONSTRAINT sessoes_usuario_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 5299 (class 2606 OID 17451)
-- Name: sites_evento sites_evento_evento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sites_evento
    ADD CONSTRAINT sites_evento_evento_id_fkey FOREIGN KEY (evento_id) REFERENCES public.eventos(id) ON DELETE CASCADE;


--
-- TOC entry 5300 (class 2606 OID 17456)
-- Name: solicitacoes_lgpd solicitacoes_lgpd_atendido_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitacoes_lgpd
    ADD CONSTRAINT solicitacoes_lgpd_atendido_por_fkey FOREIGN KEY (atendido_por) REFERENCES public.usuarios(id) ON DELETE SET NULL;


--
-- TOC entry 5301 (class 2606 OID 17461)
-- Name: solicitacoes_lgpd solicitacoes_lgpd_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitacoes_lgpd
    ADD CONSTRAINT solicitacoes_lgpd_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE RESTRICT;


--
-- TOC entry 5302 (class 2606 OID 17466)
-- Name: tarefas tarefas_evento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tarefas
    ADD CONSTRAINT tarefas_evento_id_fkey FOREIGN KEY (evento_id) REFERENCES public.eventos(id) ON DELETE CASCADE;


--
-- TOC entry 5303 (class 2606 OID 17471)
-- Name: tarefas tarefas_responsavel_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tarefas
    ADD CONSTRAINT tarefas_responsavel_id_fkey FOREIGN KEY (responsavel_id) REFERENCES public.usuarios(id) ON DELETE SET NULL;


--
-- TOC entry 5304 (class 2606 OID 17476)
-- Name: tokens_confirmacao_email tokens_confirmacao_email_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tokens_confirmacao_email
    ADD CONSTRAINT tokens_confirmacao_email_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 5305 (class 2606 OID 17481)
-- Name: tokens_recuperacao_senha tokens_recuperacao_senha_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tokens_recuperacao_senha
    ADD CONSTRAINT tokens_recuperacao_senha_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


-- Completed on 2026-09-22 22:25:29

--
-- PostgreSQL database dump complete
--

\unrestrict WbVYsYvirIalD4qKVBK12YK6mrYHKC0MaZPSz5yXCXUGjJAKPKgJmv0O2RXJtjw

