import { Router } from "express";
import transactionsController from "./transactions.controle";
import transactionsSchema from "./transactions.schemas";
import validateBody from "../../middlewares/validateBody";
import { Response, Request } from "express";
import axios from 'axios';


const router = Router();

router.get("/", transactionsController.index);
router.post("/", validateBody(transactionsSchema.create), transactionsController.create);
router.get("/:id", transactionsController.read);
router.put("/:id",validateBody(transactionsSchema.update),transactionsController.update);
router.delete("/:id", transactionsController.remove);
router.get('/quote/:tradingCode', transactionsController.getStockQuote);
router.get('/transaction_ativo/:id', transactionsController.transactionAtivo);
  
export default router;
