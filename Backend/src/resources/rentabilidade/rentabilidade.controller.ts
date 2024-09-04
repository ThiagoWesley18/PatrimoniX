import { Request, Response } from "express";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { PrismaClient } from "@prisma/client";
import { CreateRentabilidadeDto } from "./rentabilidade.types";
import { listRentabilidade, createRentabilidade ,getRentabilidadeByUser, deleteAllRentabilidadeByUser} from "./rentabilidade.services";
import { readUser } from "../user/user.service";
const prisma = new PrismaClient();

const index = async (req: Request, res: Response) => {
  try {
      const rentabilidadeGeral = await listRentabilidade();
      res.status(StatusCodes.OK).json(rentabilidadeGeral);
  } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const create = async (req: Request, res: Response) => {
  const userRentabilidade = req.body as CreateRentabilidadeDto;

  try {
    const newRentabilidade = await createRentabilidade(userRentabilidade);

    res.status(StatusCodes.CREATED).json(newRentabilidade);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Erro ao criar rentabilidade do usuario." });
  }
};

const read = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
      const userRentabilidades = await getRentabilidadeByUser(id);
      if (!userRentabilidades) {
          return res.status(StatusCodes.NOT_FOUND).json(ReasonPhrases.NOT_FOUND);
      }
      return res.json(userRentabilidades)
  } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
      const user = await readUser(id);
      if(user){
        const deletedRentabilidade = await deleteAllRentabilidadeByUser(id)   
        res.status(StatusCodes.OK).json(deletedRentabilidade);
      }else{
          res.status(StatusCodes.NOT_FOUND).json(ReasonPhrases.NOT_FOUND);
      }
  } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
}

export default { index, create, read, remove };
