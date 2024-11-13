import CreateBookDto from "../interfaces/create-book-dto";
import Book from "../models/book.model";
import { handleUploadFile } from "../utils/handleUploadFile";
import { validateFile } from "../utils/validateFile";


const createOne = async (createBookDto: CreateBookDto, imageFile: Express.Multer.File) => {
    try {
        const book = await Book.create(createBookDto);
        const { id } = book;
        const { size, buffer, mimetype } = imageFile;
        validateFile(mimetype, size);
        const image = await handleUploadFile({ filename: id, mimetype, buffer });
        book.image = image;
        return await book.save();
    } catch (error) {
        throw error;
    }
}
const getAll = async () => {
    try {
        return await Book.find();
    } catch (error) {
        throw error;
    }
}

const getOneById = async (id: string) => {
    try {
        return await Book.findById(id);
    } catch (error) {
        throw error;
    }
}

const updateOneById = async (id: string, updateBookDto: CreateBookDto) => {
    try {
        return await Book.findByIdAndUpdate(id, updateBookDto);
    } catch (error) {
        throw error;
    }
}

const addGenre = async (id: string, genre: string) => {
    try {
        return await Book.findByIdAndUpdate(id, { $push: { genre } });
    } catch (error) {
        throw error;
    }
}

const deleteOneById = async (id: string) => {
    try {
        return await Book.findByIdAndDelete(id);
    } catch (error) {
        throw error;
    }
}

const getAllByGenre = async (genre: string) => {
    try {
        return await Book.find({ genre });
    } catch (error) {
        throw error;
    }
}

const getAllByUserId = async (userId: string) => {
    try {
        return await Book.find({ user: userId });
    } catch (error) {
        throw error;
    }
}

export const bookService = {
    createOne,
    getAll,
    getOneById,
    updateOneById,
    deleteOneById,
    addGenre,
    getAllByGenre,
    getAllByUserId
}