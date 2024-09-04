import { Router } from "express";
import transactionRouter from "../resources/transactions/transactions.router";
import ativoRouter from "../resources/ativo/ativo.router";
import userRouter from "../resources/user/user.router";
import authRouter from "../resources/auth/auth.router";
import changesRouter from "../resources/changelog/changelog.router";
import tipoAtivoRouter from "../resources/tipo_ativo/tipo_ativo.router";
import apiRouter from "../resources/api/api.router";
import perguntaRouter from "../resources/pergunta/pergunta.router";
import respostaAtivoRouter from "../resources/resposta_ativo/resposta_ativo.router";
import metaRouter from "../resources/metas/meta.router";
import reportRouter from "../resources/report/report.router";
import rentabilidadeRouter from "../resources/rentabilidade/rentabilidade.router";

const router = Router();

router.use("/", authRouter);
router.use("/transaction", transactionRouter);
router.use("/ativo", ativoRouter);
router.use("/tipo_ativo", tipoAtivoRouter);
router.use("/user", userRouter);
router.use("/change", changesRouter);
router.use("/stockQuote", apiRouter);
router.use("/pergunta", perguntaRouter);
router.use("/resposta_ativo", respostaAtivoRouter)
router.use("/meta", metaRouter);
router.use("/report", reportRouter);
router.use("/rentabilidade", rentabilidadeRouter);

export default router;
