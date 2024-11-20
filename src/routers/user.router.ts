import { Router } from "express";
import { createOne, getAll, getOneById } from "../controllers/user.controller";

export const userRouter = Router();
userRouter.post('/', createOne);
userRouter.get('/', getAll)
userRouter.get('/:id', getOneById)

