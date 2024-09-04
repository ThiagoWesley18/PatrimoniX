import { Tipo_Ativo } from "@prisma/client";

export type CreateTipoAtivoDto = Pick<Tipo_Ativo, "tipo">