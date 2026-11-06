-- 001 - Login com Google
-- Contas criadas so com o Google nao tem senha, e o google_id vincula a conta.
-- Pode ser executado mais de uma vez sem problema.

ALTER TABLE usuarios ALTER COLUMN senha_hash DROP NOT NULL;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE;