import { Router } from "express";
import changelogController from "./changelog.controller";
const router = Router();

//router.get("/", changelogController.index)
router.get("/:id", changelogController.read)
router.post("/", changelogController.create)

export default router;