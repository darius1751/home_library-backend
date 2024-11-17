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
import { validateJWT } from "../middlewares/validateJWT.middleware";

export const bookRouter = Router();
const storage = memoryStorage();
const uploadFile = multer({
    storage,
});

bookRouter.post('/', validateJWT, uploadFile.single('cover'), createOne);
bookRouter.get('/', getAll);
bookRouter.get('/user/:id', validateJWT, getAllByUserId);
bookRouter.get('/:id', validateJWT, getOneById);
bookRouter.put('/:id', validateJWT, uploadFile.single('cover'), updateOneById);
bookRouter.patch('/:id', validateJWT, uploadFile.single('cover'), updateOneById);
bookRouter.delete('/:id', validateJWT, deleteOneById);
bookRouter.put('/:id', validateJWT, addGenre);
bookRouter.get('/genre/:genre', validateJWT, getAllByGenre);
