import { Router } from "express";
import multer, { memoryStorage } from "multer";
import {
    createOne,
    deleteOneById,
    getAll,
    getAllByUserId,
    getOneById,
    updateOneById,
    getAllByGenre,
    addGenre
} from "../controllers/book.controller";

export const bookRouter = Router();
const storage = memoryStorage();
const uploadFile = multer({
    storage,
});

bookRouter.post('/', uploadFile.single('image'), createOne);
bookRouter.get('/', getAll)
bookRouter.get('/user/:id', getAllByUserId)
bookRouter.get('/:id', getOneById)
bookRouter.patch('/:id', uploadFile.single('image'), updateOneById)
bookRouter.delete('/:id', deleteOneById)
bookRouter.put('/:id', addGenre)
bookRouter.get('/genre/:genre', getAllByGenre)
