import { 
  StatusConsulta, 
  Especialidade, 
  Genero, 
  TipoConsulta, 
  Prioridade 
} from '../types';

export interface Endereco {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export interface Paciente {
  id: string;
  nomeCompleto: string;
  cpf: string;
  dataNascimento: string;
  genero: Genero;
  telefone: string;
  email: string;
  endereco: Endereco;
  convenio?: string;
  numeroCarteirinha?: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface Medico {
  id: string;
  nomeCompleto: string;
  crm: string;
  especialidade: Especialidade;
  telefone: string;
  email: string;
  valorConsulta: number;
  disponivelTelemedicina: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export interface Consulta {
  id: string;
  pacienteId: string;
  medicoId: string;
  dataHora: string;
  tipo: TipoConsulta;
  status: StatusConsulta;
  prioridade: Prioridade;
  observacoes?: string;
  valor: number;
  criadoEm: string;
  atualizadoEm: string;
}

export interface ConsultaCompleta extends Consulta {
  paciente: Paciente;
  medico: Medico;
}

export interface FiltrosConsulta {
  status?: StatusConsulta[];
  especialidade?: Especialidade[];
  dataInicio?: string;
  dataFim?: string;
  medicoId?: string;
  pacienteId?: string;
}

export interface EstatisticasConsultas {
  total: number;
  agendadas: number;
  confirmadas: number;
  emAndamento: number;
  concluidas: number;
  canceladas: number;
  naoCompareceram: number;
  valorTotal: number;
}