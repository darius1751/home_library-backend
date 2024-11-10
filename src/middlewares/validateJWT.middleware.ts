import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export const validateJWT = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { token } = request.cookies;
        if (!token) {
            response.status(402).json({
                message: `Token is required`
            })
            return;
        }
        verify(token, process.env.JWT_SECRET || '');
    } catch (error) {
        response.status(401).json(error);
    }
}