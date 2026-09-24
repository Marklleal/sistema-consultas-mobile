export type StatusConsulta = 
  | 'agendada' 
  | 'confirmada' 
  | 'em_andamento' 
  | 'concluida' 
  | 'cancelada' 
  | 'nao_compareceu';

export type Especialidade = 
  | 'cardiologia' 
  | 'dermatologia' 
  | 'endocrinologia' 
  | 'gastroenterologia' 
  | 'geriatria' 
  | 'ginecologia' 
  | 'neurologia' 
  | 'oftalmologia' 
  | 'ortopedia' 
  | 'pediatria' 
  | 'psiquiatria' 
  | 'urologia';

export type Genero = 'masculino' | 'feminino' | 'outro' | 'prefiro_nao_informar';

export type TipoConsulta = 'presencial' | 'telemedicina';

export type Prioridade = 'baixa' | 'media' | 'alta' | 'urgente';