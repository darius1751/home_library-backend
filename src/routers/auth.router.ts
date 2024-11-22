import { Router } from "express";
import { getOneById, login, updateOne } from "../controllers/auth.controller";
import { validateResetJWT } from "../middlewares/validateJWT.middleware";

export const authRouter = Router();
authRouter.post('/login', login);
authRouter.put('/reset-password/:id', validateResetJWT, updateOne);
authRouter.get('/:id', getOneById)
// authRouter.put('/logout', logout);
// authRouter.patch('/logout', logout);