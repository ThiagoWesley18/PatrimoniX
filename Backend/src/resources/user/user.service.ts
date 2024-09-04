import { genSalt, hash } from "bcryptjs";
import { CreateUserDto, UserDto, UpdateUserDto } from "./user.types";
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export const createUser = async (usuario: CreateUserDto): Promise<UserDto> => {
  const rounds = parseInt(process.env.BCRYPT_ROUNDS!);
  const salt = await genSalt(rounds);
  const password = await hash(usuario.password, salt);
  return await prisma.user.create({
    select: {
      cpf: true,
      name: true,
      email: true,
      lastName: true,
      phone: true,
    },
    data: {
      ...usuario,
      password,
    },
  });
};

export const listUsers = async (): Promise<User[]> => {
  return await prisma.user.findMany({});
};

export const readUser = async (id: string): Promise<User | null> => {
  return await prisma.user.findUnique({ where: { cpf: id } });
};

export const checkEmail = async (
  email: string,
  ignoreId?: string
): Promise<boolean> => {
  const usuario = await prisma.user.findUnique({ where: { email } });
  if (!usuario) return true;
  if (ignoreId && usuario.cpf === ignoreId) return true;
  return false;
};

export const updateUser = async (
  id: string,
  usuario: UpdateUserDto
): Promise<User> => {
  const rounds = parseInt(process.env.BCRYPT_ROUNDS!);
  const salt = await genSalt(rounds);
  const password = await hash(usuario.password, salt);
  return await prisma.user.update({ data: {...usuario, password: password}, where: { cpf: id } });
};

export const deleteUser = async (id: string): Promise<User> => {
  return await prisma.user.delete({ where: { cpf: id } });
};
