import { transport } from '../config/email.config';
import { Request, Response } from "express";
import {userService} from '../services/user.service';

export const sendBookEmail = async (request: Request, response: Response) => {
   const {sender, receiver, name, friend, id, lastname} = request.body;
    await transport.sendMail({
        from: `${name} ${lastname} <${sender}>`,
        to: receiver,
        cc: sender,
        subject: `${name} ${lastname} sent you their book list`,
        text: `Hi ${friend}! \n\n Here are all the books in my library. You can see what books I have and what books are in my wishlist. \n\n Click the link below to see the list: \n\n http://localhost:3000/dashboard/books/${id} \n\n Love, ${name}`,
    })
}

export const sendPasswordEmail = async (request: Request, response: Response) => {
    const { email} = request.body;
    const user = await userService.getOneByEmail(email);
    const id = user?.id;
    const name = user?.name;
    await transport.sendMail({
        from: `Home Library <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Password Reset',
        text: `Hi ${name}! \n\n Click the link below to reset your password: \n\n http://localhost:3000/reset-password/${id} \n\n Love, Home Library`,

 } )}