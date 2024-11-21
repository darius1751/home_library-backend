import { Request, Response } from "express";
import { avatarService } from "../services/avatar.service";

export const getAll = async (request: Request, response: Response) => {
    try {
        const avatars = await avatarService.getAll();
        response.json(avatars);
    } catch (error: any) {
        const { statusCode = 500 } = error;
        response.status(statusCode).json(error);
    }
}