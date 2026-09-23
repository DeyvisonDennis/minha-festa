export type StatusRsvp = "CONFIRMADO" | "NAO_CONFIRMADO" | "PENDENTE";

export type Convidado = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  grupo: string;
  emailEnviadoEm: string | null; // formato "05 Jan" ou null
  statusRsvp: StatusRsvp;
};

// Mock alinhado à tabela `convidados` do banco — será substituído por
// dados reais quando implementarmos a Gestão de Eventos + API de Convidados.
export const CONVIDADOS_MOCK: Convidado[] = [
  { id: "1", nome: "Marcos Oliveira", email: "marcos@email.com", telefone: "(11) 99876-5432", grupo: "Família noivo", emailEnviadoEm: "05 Jan", statusRsvp: "CONFIRMADO" },
  { id: "2", nome: "Juliana Costa", email: "juliana@email.com", telefone: "(11) 98765-4321", grupo: "Amigos noiva", emailEnviadoEm: "05 Jan", statusRsvp: "PENDENTE" },
  { id: "3", nome: "Rafael Pereira", email: "rafael@email.com", telefone: "(11) 97654-3210", grupo: "Colegas trabalho", emailEnviadoEm: "05 Jan", statusRsvp: "CONFIRMADO" },
  { id: "4", nome: "Camila Torres", email: "camila@email.com", telefone: "(11) 96543-2109", grupo: "Família noiva", emailEnviadoEm: "05 Jan", statusRsvp: "NAO_CONFIRMADO" },
  { id: "5", nome: "Bruno Almeida", email: "bruno@email.com", telefone: "(11) 95432-1098", grupo: "Família noivo", emailEnviadoEm: "05 Jan", statusRsvp: "CONFIRMADO" },
  { id: "6", nome: "Fernanda Lima", email: "fernanda@email.com", telefone: "(11) 94321-0987", grupo: "Amigos noivo", emailEnviadoEm: null, statusRsvp: "PENDENTE" },
  { id: "7", nome: "Diego Santos", email: "diego@email.com", telefone: "(11) 93210-9876", grupo: "Família noiva", emailEnviadoEm: null, statusRsvp: "CONFIRMADO" },
  { id: "8", nome: "Amanda Rodrigues", email: "amanda@email.com", telefone: "(11) 92109-8765", grupo: "Amigos noiva", emailEnviadoEm: null, statusRsvp: "PENDENTE" },
];

export const RSVP_CONFIG: Record<StatusRsvp, { label: string; text: string }> = {
  CONFIRMADO: { label: "Confirmado", text: "text-green-600" },
  PENDENTE: { label: "Aguardando", text: "text-amber-600" },
  NAO_CONFIRMADO: { label: "Recusado", text: "text-red-600" },
};

export const LINK_RSVP_MOCK = "minhafesta.app/rsvp/casamento-ana-pedro";