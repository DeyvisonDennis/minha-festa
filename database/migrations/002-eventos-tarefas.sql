-- 002 - Eventos e tarefas
-- Numero estimado de convidados no evento, e categoria e ordem (Kanban) nas tarefas.
-- Pode ser executado mais de uma vez sem problema.

ALTER TABLE eventos ADD COLUMN IF NOT EXISTS convidados_estimados INTEGER;
ALTER TABLE eventos DROP CONSTRAINT IF EXISTS chk_evento_convidados_estimados;
ALTER TABLE eventos ADD CONSTRAINT chk_evento_convidados_estimados
  CHECK (convidados_estimados IS NULL OR convidados_estimados >= 0);

ALTER TABLE tarefas ADD COLUMN IF NOT EXISTS categoria VARCHAR(100);
ALTER TABLE tarefas ADD COLUMN IF NOT EXISTS ordem INTEGER NOT NULL DEFAULT 0;