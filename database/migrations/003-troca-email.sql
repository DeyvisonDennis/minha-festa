-- 003 - Troca de e-mail
-- Guarda o e-mail novo no token de confirmacao. NULL = confirmacao de cadastro;
-- preenchido = pedido de troca de e-mail aguardando o clique no link.
-- Pode ser executado mais de uma vez sem problema.

ALTER TABLE tokens_confirmacao_email ADD COLUMN IF NOT EXISTS novo_email CITEXT;