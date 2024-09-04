export interface pergunta {
    id: number;
    criterio: string;
    texto: string;
}

export interface CreatePerguntaDto {
    criterio: string;
    texto: string;
}