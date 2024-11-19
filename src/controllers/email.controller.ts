import { transport } from '../config/email.config';
import { Request, Response } from "express";

export const sendBookEmail = async (request: Request, response: Response) => {
   const {sender, receiver, name, friend, id} = request.body;
    await transport.sendMail({
        from: sender,
        to: receiver,
        cc: sender,
        subject: `${name} sent you their book list`,
        text: `Hi ${friend}! \n\n Here are all the books in my library. You can see what books I have and what books are in my wishlist. \n\n Click the link below to see the list: \n\n http://localhost:3000/dashboard/books/${id} \n\n Love, ${name}`,
    })
}