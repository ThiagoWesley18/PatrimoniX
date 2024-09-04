import { Router } from "express";
import apiController from "./api.controller";
import validateBody from "../../middlewares/validateBody";
import { apiSchema } from "./api.schemas";

const router = Router();

router.post("/setQuotes", validateBody(apiSchema.setQuote), apiController.setStockQuote);
router.post("/getQuotes", validateBody(apiSchema.setQuote),apiController.getQuotes);
router.get("/setQuoteLabel/:label", apiController.setStockQuoteLabel);
router.get("/getQuoteLabel/:label", apiController.getQuoteLabel);
export default router;