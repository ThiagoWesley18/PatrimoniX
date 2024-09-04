import { Router } from "express";
import userController from "./user.controller";
import userSchema from "./user.schemas";
import validateBody from "../../middlewares/validateBody";

const router = Router();

router.post("/", validateBody(userSchema.create), userController.create);
router.get("/", userController.index);
router.get("/:id", userController.read);
router.put("/:id", userController.update);
router.delete("/:id", userController.remove);

export default router;
