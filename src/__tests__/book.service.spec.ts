import { bookService } from "../services/book.service";
import Book from "../models/book.model";
import { handleUploadFile } from "../utils/handleUploadFile";
import { validateFile } from "../utils/validateFile";
import CreateBookDto from "../interfaces/create-book-dto";

jest.mock("../models/book.model", () => ({
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn()
}));

jest.mock("../utils/handleUploadFile", () => ({
    handleUploadFile: jest.fn()
}));

jest.mock("../utils/validateFile", () => ({
    validateFile: jest.fn()
}));

describe('Book service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createOne', () => {
        it('should create a book successfully', async () => {
            const mockBook = { id: "1", save: jest.fn().mockResolvedValue({ id: "1", image: "image_url" }) };
            const mockImageFile = { size: 1000, buffer: Buffer.from("test"), mimetype: "image/jpeg" } as Express.Multer.File;
            (Book.create as jest.Mock).mockResolvedValue(mockBook);
            (handleUploadFile as jest.Mock).mockResolvedValue("image_url");

            const result = await bookService.createOne({ title: "Test Book" } as CreateBookDto, mockImageFile);

            expect(Book.create).toHaveBeenCalledWith({ title: "Test Book" });
            expect(validateFile).toHaveBeenCalledWith("image/jpeg", 1000);
            expect(handleUploadFile).toHaveBeenCalledWith({ filename: "1", mimetype: "image/jpeg", buffer: Buffer.from("test"), isAvatar: false });
            expect(mockBook.save).toHaveBeenCalled();
            expect(result).toEqual({ id: "1", image: "image_url" });
        });

        it('should handle create book error', async () => {
            const mockError = new Error("Internal Server Error");
            (Book.create as jest.Mock).mockRejectedValue(mockError);

            await expect(bookService.createOne({ title: "Test Book" } as CreateBookDto, {} as Express.Multer.File)).rejects.toThrow(mockError);
        });
    });

    describe('getAll', () => {
        it('should get all books successfully', async () => {
            const mockBooks = [{ id: "1", title: "Test Book 1" }, { id: "2", title: "Test Book 2" }];
            (Book.find as jest.Mock).mockResolvedValue(mockBooks);

            const result = await bookService.getAll();

            expect(Book.find).toHaveBeenCalled();
            expect(result).toEqual(mockBooks);
        });

        it('should handle get all books error', async () => {
            const mockError = new Error("Internal Server Error");
            (Book.find as jest.Mock).mockRejectedValue(mockError);

            await expect(bookService.getAll()).rejects.toThrow(mockError);
        });
    });

    describe('getOneById', () => {
        it('should get a book by id successfully', async () => {
            const mockBook = { id: "1", title: "Test Book" };
            (Book.findById as jest.Mock).mockResolvedValue(mockBook);

            const result = await bookService.getOneById("1");

            expect(Book.findById).toHaveBeenCalledWith("1");
            expect(result).toEqual(mockBook);
        });

        it('should handle get book by id error', async () => {
            const mockError = new Error("Internal Server Error");
            (Book.findById as jest.Mock).mockRejectedValue(mockError);

            await expect(bookService.getOneById("1")).rejects.toThrow(mockError);
        });
    });

    describe('updateOneById', () => {
        it('should update a book successfully', async () => {
            const mockBook = { id: "1", save: jest.fn().mockResolvedValue({ id: "1", image: "image_url" }) };
            const mockImageFile = { size: 1000, buffer: Buffer.from("test"), mimetype: "image/jpeg" } as Express.Multer.File;
            (Book.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockBook);
            (handleUploadFile as jest.Mock).mockResolvedValue("image_url");

            const result = await bookService.updateOneById("1", { title: "Updated Book" } as CreateBookDto, mockImageFile);

            expect(Book.findByIdAndUpdate).toHaveBeenCalledWith("1", { title: "Updated Book" }, { new: true });
            expect(validateFile).toHaveBeenCalledWith("image/jpeg", 1000);
            expect(handleUploadFile).toHaveBeenCalledWith({ filename: "1", mimetype: "image/jpeg", buffer: Buffer.from("test"), isAvatar: false });
            expect(mockBook.save).toHaveBeenCalled();
            expect(result).toEqual({ id: "1", image: "image_url" });
        });

        it('should handle update book error', async () => {
            const mockError = new Error("Internal Server Error");
            (Book.findByIdAndUpdate as jest.Mock).mockRejectedValue(mockError);

            await expect(bookService.updateOneById("1", { title: "Updated Book" } as CreateBookDto, {} as Express.Multer.File)).rejects.toThrow(mockError);
        });
    });

    describe('addGenre', () => {
        it('should add a genre to a book successfully', async () => {
            const mockBook = { id: "1", genres: ["Fiction"] };
            (Book.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockBook);

            const result = await bookService.addGenre("1", "Fiction");

            expect(Book.findByIdAndUpdate).toHaveBeenCalledWith("1", { $push: { genre: "Fiction" } });
            expect(result).toEqual(mockBook);
        });

        it('should handle add genre error', async () => {
            const mockError = new Error("Internal Server Error");
            (Book.findByIdAndUpdate as jest.Mock).mockRejectedValue(mockError);

            await expect(bookService.addGenre("1", "Fiction")).rejects.toThrow(mockError);
        });
    });

    describe('deleteOneById', () => {
        it('should delete a book by id successfully', async () => {
            const mockBook = { id: "1", title: "Test Book" };
            (Book.findByIdAndDelete as jest.Mock).mockResolvedValue(mockBook);

            const result = await bookService.deleteOneById("1");

            expect(Book.findByIdAndDelete).toHaveBeenCalledWith("1");
            expect(result).toEqual(mockBook);
        });

        it('should handle delete book by id error', async () => {
            const mockError = new Error("Internal Server Error");
            (Book.findByIdAndDelete as jest.Mock).mockRejectedValue(mockError);

            await expect(bookService.deleteOneById("1")).rejects.toThrow(mockError);
        });
    });

    describe('getAllByGenre', () => {
        it('should get all books by genre successfully', async () => {
            const mockBooks = [{ id: "1", title: "Test Book 1", genre: "Fiction" }, { id: "2", title: "Test Book 2", genre: "Fiction" }];
            (Book.find as jest.Mock).mockResolvedValue(mockBooks);

            const result = await bookService.getAllByGenre("Fiction");

            expect(Book.find).toHaveBeenCalledWith({ genre: "Fiction" });
            expect(result).toEqual(mockBooks);
        });

        it('should handle get all books by genre error', async () => {
            const mockError = new Error("Internal Server Error");
            (Book.find as jest.Mock).mockRejectedValue(mockError);

            await expect(bookService.getAllByGenre("Fiction")).rejects.toThrow(mockError);
        });
    });

    describe('getAllByUserId', () => {
        it('should get all books by user id successfully', async () => {
            const mockBooks = [{ id: "1", title: "Test Book 1", user: "1" }, { id: "2", title: "Test Book 2", user: "1" }];
            (Book.find as jest.Mock).mockResolvedValue(mockBooks);

            const result = await bookService.getAllByUserId("1");

            expect(Book.find).toHaveBeenCalledWith({ user: "1" });
            expect(result).toEqual(mockBooks);
        });

        it('should handle get all books by user id error', async () => {
            const mockError = new Error("Internal Server Error");
            (Book.find as jest.Mock).mockRejectedValue(mockError);

            await expect(bookService.getAllByUserId("1")).rejects.toThrow(mockError);
        });
    });
});