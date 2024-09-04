import { Router } from "express";
import ReportController from "./report.controller";
import validateBody from "../../middlewares/validateBody";
import ReportSchema from "./report.schemas";


const router = Router();

router.get("/", ReportController.index);
router.get("/:id", ReportController.read);
router.post("/",validateBody(ReportSchema.create), ReportController.create);


export default router;