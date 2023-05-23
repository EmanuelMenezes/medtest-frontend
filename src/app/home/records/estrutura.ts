export interface Dialogo {
  conversa: [
    {
      personagem: string; //M - Medico, P - Paciente
      mensagem: string;
    }
  ];
  proxFluxo: number;
}

export interface Questao {
  pergunta: string;
  respostas: Resposta[];
}

export interface Exame {
  fileBlob?: string;
  filetype?: string;
  informacaoTexto?: [
    {
      titulo: string;
      texto: string;
    }
  ];
  proxFluxo: number;
}

export interface Resposta {
  texto: string;
  isCorrect: boolean;
  proxFluxo: number;
  pontuacao: number;
}

export interface Transicao {
  tipo: string; // G - Game Over, V - Vitoria, M - Melhora, P - Piora, S - Start
  proxFluxo: number;
}

export interface CasoClinico {
  paciente: {
    idPersonagem: number;
    nome: string;
    descricao: string;
  };
  idCenario: number;
  idMedico: number;
  descricao: string;
  fluxo: [
    {
      idFluxo: number;
      dialogo?: Dialogo;
      exame?: Exame;
      questao?: Questao;
      transicao?: Transicao;
    }
  ];
}
