import { Router } from "express";
import { login } from "../controllers/auth.controller";

export const authRouter = Router();
authRouter.post('/login', login);
// authRouter.put('/logout', logout);
// authRouter.patch('/logout', logout);