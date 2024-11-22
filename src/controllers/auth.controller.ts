import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { sign } from "jsonwebtoken";

export const login = async (request: Request, response: Response) => {
    try {
        const credential = request.body;
        const user = await authService.login(credential);
        const username = credential.user;
        const { id, name } = user;
        const token = sign({ id, name, username }, process.env.JWT_SECRET || '', { expiresIn: '1h' });
        // response.cookie("token", token, { httpOnly: true, secure: true }).json(user);
        response.json({ user, token });
    } catch (error: any) {
        const { statusCode = 500 } = error;
        console.log({ error })
        response.status(statusCode).json(error);
    }
}

export const updateOne = async (request: Request, response: Response) => {
    try {
        const { id } = request.params;
        const credential = request.body;
        const newCredential = await authService.updateOne(id, credential);
        response.json(newCredential);
    } catch (error: any) {
        const { statusCode = 500 } = error;
        response.status(statusCode).json(error);
    }
}

export const getOneById = async (request: Request, response: Response) => { 
    try {
        const { id } = request.params;
        const user = await authService.getOneById(id);
        response.json(user);
    } catch (error: any) {
        const { statusCode = 500 } = error;
        response.status(statusCode).json(error);
    }
}

// export const logout = async (_request: Request, response: Response) => {
//     try {
//         response.clearCookie("token").json({ message: `Logout successfull` })
//     } catch (error) {
//         response.status(403).json({ message: `Not exists token in cookies` });
//     }
// }