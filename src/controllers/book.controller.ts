import { Request, Response } from "express";
import { bookService } from "../services/book.service";

export const createOne = async (request: Request, response: Response) => {
    try {
        const { file, body: createBookDto } = request;
        if (!file)
            throw {
                statusCode: 400,
                message: `The image is required`
            }
        const book = await bookService.createOne(createBookDto, file!);
        response.json(book);
    } catch (error: any) {
        const { statusCode = 500 } = error;
        response.status(statusCode).json(error);
    }
}

export const getAll = async (_request: Request, response: Response) => {
    try {
        const books = await bookService.getAll();
        response.json(books);
    } catch (error: any) {
        const { statusCode = 500 } = error;
        response.status(statusCode).json(error);
    }
}

export const getOneById = async (request: Request, response: Response) => {
    try {
        const { id } = request.params;
        const book = await bookService.getOneById(id);
        response.json(book);
    } catch (error: any) {
        const { statusCode = 500 } = error;
        response.status(statusCode).json(error);
    }
}

export const updateOneById = async (request: Request, response: Response) => {
    try {
        const { id } = request.params;
        const { file } = request;
        const updateBookDto = request.body;
        const book = await bookService.updateOneById(id, updateBookDto, file);
        response.json(book);
    } catch (error: any) {
        const { statusCode = 500 } = error;
        response.status(statusCode).json(error);
    }
}

export const addGenre = async (request: Request, response: Response) => {
    try {
        const { id } = request.params;
        const { genre } = request.body;
        const book = await bookService.addGenre(id, genre);
        response.json(book);
    } catch (error: any) {
        const { statusCode = 500 } = error;
        response.status(statusCode).json(error);
    }
}

export const getAllByGenre = async (request: Request, response: Response) => {
    try {
        const { genre } = request.params;
        const books = await bookService.getAllByGenre(genre);
        response.json(books);
    } catch (error: any) {
        const { statusCode = 500 } = error;
        response.status(statusCode).json(error);
    }
}

export const deleteOneById = async (request: Request, response: Response) => {
    try {
        const { id } = request.params;
        const book = await bookService.deleteOneById(id);
        response.json(book);
    } catch (error: any) {
        const { statusCode = 500 } = error;
        response.status(statusCode).json(error);
    }
}

export const getAllByUserId = async (request: Request, response: Response) => {
    try {
        const { id } = request.params;
        const books = await bookService.getAllByUserId(id);
        response.json(books);
    } catch (error: any) {
        const { statusCode = 500 } = error;
        response.status(statusCode).json(error);
    }
}