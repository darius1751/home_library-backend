import { Router } from "express";
import { sendBookEmail } from "../controllers/email.controller";

export const emailRouter = Router();
emailRouter.post('/', sendBookEmail);

