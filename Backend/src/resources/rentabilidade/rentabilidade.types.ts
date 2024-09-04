import { Rentabilidade } from "@prisma/client";

export type CreateRentabilidadeDto = Pick<Rentabilidade, "id" | "month" | "carteira" | "cdi" | "ibovespa" | "userCpf">