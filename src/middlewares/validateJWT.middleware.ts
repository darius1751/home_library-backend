import  { NextFunction, query, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export const validateJWT = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { token } = request.headers;
        if (!token) {
            response.status(402).json({
                message: `Token is required`
            })
            return;
        }
        verify(token as string, process.env.JWT_SECRET || '');
        next();
    } catch (error) {
        response.status(401).json(error);
    }
}


export const validateResetJWT = async (request: Request, response: Response, next: NextFunction) => {

    try {
        const token = request.query.token
        console.log("token",token)
        /*
        if (!token) {
            response.status(402).json({
                message: `Token is required`
            })
            return;
        }
        verify(token as string, process.env.JWT_SECRET || '');
        */
        next();
        
    } catch (error) {
        response.status(401).json(error);
    }
}