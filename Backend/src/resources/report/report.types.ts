import {Report} from "@prisma/client";

export type CreateReportDto = Pick<Report, "id" | "titulo" | "localizacao" | "conteudo" | "userCpf" | "tipo">;