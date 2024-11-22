import { Request, Response } from "express";
import { userService } from "../services/user.service";
import { validateMongoId } from "../utils/validateMongoId";

export const createOne = async (request: Request, response: Response) => {
    try {
        const createUserDto = request.body;
        const user = await userService.createOne(createUserDto);
        response.json(user);
    } catch (error: any) {
        const { statusCode = 500 } = error;
        response.status(statusCode).json(error);
    }
}
export const getAll = async (_request: Request, response: Response) => {
    try {
        const users = await userService.getAll();
        response.json(users);
    } catch (error: any) {
        const { statusCode = 500 } = error;
        response.status(statusCode).json(error);
    }
}

export const getOneById = async (request: Request, response: Response) => {
    try {
        const { id } = request.params;
        validateMongoId(id);
        const user = await userService.getOneById(id);
        response.json(user);
    } catch (error: any) {
        const { statusCode = 500 } = error;
        response.status(statusCode).json(error);
    }
}

export const getOneByEmail = async (request: Request, response: Response) => {  
    try {
        const { email } = request.params;
        const user = await userService.getOneByEmail(email);
        response.json(user);
    } catch (error: any) {
        const { statusCode = 500 } = error;
        response.status(statusCode).json(error);
    }
}

