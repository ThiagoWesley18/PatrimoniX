import { User } from "@prisma/client";

export type CreateUserDto = Pick<
  User,
  "cpf" | "name" | "lastName" | "email" | "password" | "phone"
>;

export type UpdateUserDto = Pick<User, "cpf" | "name" | "lastName" | "email" | "password" | "phone">;

export type UserDto = Omit<User, "password">;
