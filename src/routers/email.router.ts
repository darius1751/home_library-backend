import { Router } from "express";
import { sendBookEmail, sendPasswordEmail, sendWelcomeEmail } from "../controllers/email.controller";

export const emailRouter = Router();
emailRouter.post('/', sendBookEmail);
emailRouter.post('/password', sendPasswordEmail);
emailRouter.post('/welcome', sendWelcomeEmail);

