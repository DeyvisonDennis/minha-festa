-- 004 - Evento ativo por usuario
-- Guarda qual evento a pessoa escolheu no seletor da Sidebar. NULL = o mais recente.
-- Sem chave estrangeira de proposito: o backend confere se o evento existe e e da
-- pessoa (e cai no mais recente se nao for). Pode ser executado mais de uma vez.

ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS evento_ativo_id UUID;