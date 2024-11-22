import { Router } from "express";
import { getAll } from "../controllers/avatar.controller";

export const avatarRouter = Router();
avatarRouter.get('', getAll);