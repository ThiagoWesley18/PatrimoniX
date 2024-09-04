export interface respostaAtivo {
    id: number;
    ativoCodigo: string;
    perguntaId: number;
    resposta: boolean;
    peso: number;
}


export interface CreateRespostaAtivoDto {
    ativoCodigo: string;
    perguntaId: number;
    resposta: boolean;
}

export interface UpdateRespostaAtivoPayload {
    peso: number;
}