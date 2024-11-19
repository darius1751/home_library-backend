import { Router } from "express";
import { sendBookEmail, sendPasswordEmail } from "../controllers/email.controller";

export const emailRouter = Router();
emailRouter.post('/', sendBookEmail);
emailRouter.post('/password', sendPasswordEmail);

