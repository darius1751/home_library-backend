import { Router } from "express";
import { createOne, deleteOneById, getAll, getAllByUserId, getOneById, updateOneById, getAllByGenre, addGenre } from "../controllers/book.controller";

export const bookRouter = Router();

bookRouter.post('/', createOne);
bookRouter.get('/', getAll)
bookRouter.get('/user/:id', getAllByUserId)
bookRouter.get('/:id', getOneById)
bookRouter.patch('/:id', updateOneById)
bookRouter.delete('/:id', deleteOneById)
bookRouter.put('/:id', addGenre)
bookRouter.get('/genre/:genre', getAllByGenre)