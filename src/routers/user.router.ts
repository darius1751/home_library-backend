import { Router } from "express";
import { createOne, getAll, getOneById, updateById } from "../controllers/user.controller";

export const userRouter = Router();
userRouter.post('/', createOne);
userRouter.get('/', getAll)
userRouter.get('/:id', getOneById)
userRouter.put('/:id', updateById);
userRouter.get('/:id', getOneById);
