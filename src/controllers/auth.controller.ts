import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { sign } from "jsonwebtoken";

export const login = async (request: Request, response: Response) => {
    try {
        const credential = request.body;
        const user = await authService.login(credential);
        const token = sign(user.id, process.env.JWT_SECRET || '', {
            expiresIn: '10h'
        });
        response.cookie("token", token, { httpOnly: true, secure: true }).json(user);
    } catch (error: any) {
        const { statusCode = 500 } = error;
        response.status(statusCode).json(error);
    }
}

export const logout = async (_request: Request, response: Response) => {
    try {
        response.clearCookie("token").json({ message: `Logout successfull` })
    } catch (error) {
        response.status(403).json({ message: `Logout successfull` });
    }
}