import { transport } from '../config/email.config';
import { Request, RequestHandler, Response } from "express";
import {userService} from '../services/user.service';
import { sign } from "jsonwebtoken";

export const sendBookEmail: RequestHandler = async (request: Request, response: Response) => {
    try {
        const { sender, receiver, name, friend, id, lastname } = request.body;
        await transport.sendMail({
            from: `${name} ${lastname} <${sender}>`,
            to: receiver,
            cc: sender,
            subject: `${name} ${lastname} sent you their book list`,
            text: `Hi ${friend}! \n\n Here are all the books in my library. You can see what books I have and what books are in my wishlist. \n\n Click the link below to see the list: \n\n http://localhost:3000/books/${id} \n\n Love, ${name}`,
        })
        response.json({ message: 'Email sent successfully', status: 200 });
    } catch (error: any) {
        const { statusCode = 500 } = error;
        response.status(statusCode).json(error);
    }
}

export const sendPasswordEmail = async (request: Request, response: Response) => {
    const { email} = request.body;
    const user = await userService.getOneByEmail(email);
    const id = user?.id;
    const name = user?.name;
    const token = sign({ id, name }, process.env.JWT_SECRET || '', { expiresIn: '5m' });
    await transport.sendMail({
        from: `Home Library <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Password Reset',
        text: `Hi ${name}! \n\n Click the link below to reset your password: \n\n http://localhost:3000/reset-password/${id}?token=${token} \n\n Love, Home Library`,

 } )}