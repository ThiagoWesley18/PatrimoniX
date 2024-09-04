import express, { Request, Response } from "express";
import { createUser } from "../user/user.service";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { checkCredencials } from "./auth.service";
import { CreateDto, LoginDto } from "./auth.types";

const signup = async (req: Request, res: Response) => {
  const usuario = req.body as CreateDto;
  try {
    const novoUsuario = await createUser(usuario);
    res.status(StatusCodes.OK).json(novoUsuario);
  } catch (error: any) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};

const login = async (req: Request, res: Response) => {
  const credencials = req.body as LoginDto;
  try {
    const usuario = await checkCredencials(credencials);
    if (!usuario)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(ReasonPhrases.UNAUTHORIZED);
    req.session.uid = usuario.cpf;
    res.status(StatusCodes.OK).json(usuario.cpf);
  } catch (err) {
    console.log(err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
const logout = async (req: Request, res: Response) => {
  if (req.session.uid) {
    req.session.destroy(() => {
      res.status(StatusCodes.OK).json(ReasonPhrases.OK);
    });
  } else {
    res.status(StatusCodes.UNAUTHORIZED).json(ReasonPhrases.UNAUTHORIZED);
  }
};

const checkAuth = async (req: Request, res: Response) => {
  if (!req.session.uid) {
    res.status(StatusCodes.ACCEPTED).json(false);
  } else {
    res.status(StatusCodes.ACCEPTED).json(true);
  }
};

export default { signup, login, logout, checkAuth };
