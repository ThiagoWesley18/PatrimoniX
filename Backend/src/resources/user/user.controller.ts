import { Request, Response } from "express";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { PrismaClient } from "@prisma/client";
import { CreateUserDto, UpdateUserDto } from "./user.types";
import { checkEmail, deleteUser, listUsers, readUser, updateUser } from "./user.service";
import { updateStockQuotes } from "../api/api.services";
import { deleteAllTransactions } from "../transactions/transactions.service";
const prisma = new PrismaClient();

const index = async (req: Request, res: Response) => {
  try {
      const users = await listUsers();
      res.status(StatusCodes.OK).json(users);
  } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const create = async (req: Request, res: Response) => {
  const userData = req.body as CreateUserDto;

  try {
    const newUser = await prisma.user.create({
      data: userData,
    });

    res.status(StatusCodes.CREATED).json(newUser);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Erro ao criar usuário." });
  }
};

const read = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
      const user = await readUser(id);
      if (!user) {
          return res.status(StatusCodes.NOT_FOUND).json(ReasonPhrases.NOT_FOUND);
      }
      return res.json(user)
  } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userData = req.body as UpdateUserDto;
  try {
      const user = await readUser(id);
      if (user) {
          const updatedUser = await updateUser(id, userData);
          res.status(StatusCodes.OK).json(updatedUser);
      }else{
          res.status(StatusCodes.NOT_FOUND).json(ReasonPhrases.NOT_FOUND);
      }
      
  } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
      const user = await readUser(id);
      if(user){
        await deleteAllTransactions(id)
        const deletedUser = await deleteUser(id);   
        res.status(StatusCodes.OK).json(deletedUser);
      }else{
          res.status(StatusCodes.NOT_FOUND).json(ReasonPhrases.NOT_FOUND);
      }
  } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
}


export default { index, create, read, update, remove };
