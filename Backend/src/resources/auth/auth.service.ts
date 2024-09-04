import { compare } from "bcryptjs";
import { UserDto } from "../user/user.types";
import { LoginDto } from "./auth.types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const checkCredencials = async (
  credencials: LoginDto
): Promise<UserDto | null> => {
  const usuario = await prisma.user.findUnique({
    where: { email: credencials.email },
  });

  if (!usuario) return null;

  const ok = await compare(credencials.password, usuario.password);
  if (!ok) return null;

  return {
    cpf: usuario.cpf,
    name: usuario.name,
    email: usuario.email,
    lastName: usuario.lastName,
    phone: usuario.phone,
  };
};
