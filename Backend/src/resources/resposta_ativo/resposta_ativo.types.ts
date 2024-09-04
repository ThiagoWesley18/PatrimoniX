import { RespostaAtivo } from "@prisma/client";

// Simplifique o tipo, 'resposta' agora é obrigatório
export type UpdateRespostaAtivoDto = Pick<RespostaAtivo, "resposta">; 