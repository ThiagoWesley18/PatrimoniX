import { Ativo } from "@prisma/client";

export type CreateAtivoDto = Pick<Ativo ,"tradingCode" | "tipo" | "nomeInstituicao">;