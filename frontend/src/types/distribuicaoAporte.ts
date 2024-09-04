export interface distribuicaoAporte {
    id: number;
    ativoCodigo: string;
    peso: number;
}

export interface createDistribuicaoAporteDto {
    ativoCodigo: string;
    peso: number;
}

export interface updateDistribuicaoAporteDto {
    peso: number;
}