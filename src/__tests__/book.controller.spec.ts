import { Request, Response } from "express";
import { bookService } from "../services/book.service";
import { createOne, getAll, getOneById, updateOneById, addGenre, getAllByGenre, deleteOneById } from "../controllers/book.controller";

jest.mock("../services/book.service", () => ({
    bookService: {
        createOne: jest.fn(),
        getAll: jest.fn(),
        getOneById: jest.fn(),
        updateOneById: jest.fn(),
        addGenre: jest.fn(),
        getAllByGenre: jest.fn(),
        deleteOneById: jest.fn()
    }
}));

describe('Book controller', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseObject: any;

    beforeEach(() => {
        mockRequest = {
            body: {
                title: "Test Book",
                author: "Test Author",
                location: "test",
                state: "test",
                genres: [],
            },
            file: {
                fieldname: 'file',
                originalname: "test.jpg",
                encoding: '7bit',
                mimetype: 'image/jpeg',
                buffer: Buffer.from("test"),
                size: 4,
                stream: new (require('stream').Readable)(),
                destination: 'uploads/',
                filename: 'test.jpg',
                path: 'uploads/test.jpg',
            }
        };
        responseObject = {};
        mockResponse = {
            json: jest.fn().mockImplementation((result) => {
                responseObject = result;
            }),
            status: jest.fn().mockReturnThis()
        };
    });

    describe('createOne', () => {
        it('should create a book successfully', async () => {
            const mockBook = { id: 1, title: "Test Book", author: "Test Author", location: "test", state: "test", genres: [] };
            (bookService.createOne as jest.Mock).mockResolvedValue(mockBook);

            await createOne(mockRequest as Request, mockResponse as Response);

            expect(bookService.createOne).toHaveBeenCalledWith(mockRequest.body, mockRequest.file);
            expect(mockResponse.json).toHaveBeenCalledWith(mockBook);
        });

        it('should handle create book error when file is missing', async () => {
            mockRequest.file = undefined;
            const mockError = { statusCode: 400, message: "The image is required" };

            await createOne(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
            expect(mockResponse.json).toHaveBeenCalledWith(mockError);
        });

        it('should handle create book error', async () => {
            const mockError = { statusCode: 500, message: "Internal Server Error" };
            (bookService.createOne as jest.Mock).mockRejectedValue(mockError);

            await createOne(mockRequest as Request, mockResponse as Response);

            expect(bookService.createOne).toHaveBeenCalledWith(mockRequest.body, mockRequest.file);
            expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
            expect(mockResponse.json).toHaveBeenCalledWith(mockError);
        });
    });

    describe('getAll', () => {
        beforeEach(() => {
            mockRequest = {};
        });

        it('should get all books successfully', async () => {
            const mockBooks = [
                { id: 1, title: "Test Book 1", author: "Test Author 1" },
                { id: 2, title: "Test Book 2", author: "Test Author 2" }
            ];
            (bookService.getAll as jest.Mock).mockResolvedValue(mockBooks);

            await getAll(mockRequest as Request, mockResponse as Response);

            expect(bookService.getAll).toHaveBeenCalled();
            expect(mockResponse.json).toHaveBeenCalledWith(mockBooks);
        });

        it('should handle get all books error', async () => {
            const mockError = { statusCode: 500, message: "Internal Server Error" };
            (bookService.getAll as jest.Mock).mockRejectedValue(mockError);

            await getAll(mockRequest as Request, mockResponse as Response);

            expect(bookService.getAll).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
            expect(mockResponse.json).toHaveBeenCalledWith(mockError);
        });
    });

    describe('getOneById', () => {
        it('should get a book by id successfully', async () => {
            const mockBook = { id: 1, title: "Test Book", author: "Test Author" };
            mockRequest.params = { id: '1' };
            (bookService.getOneById as jest.Mock).mockResolvedValue(mockBook);

            await getOneById(mockRequest as Request, mockResponse as Response);

            expect(bookService.getOneById).toHaveBeenCalledWith('1');
            expect(mockResponse.json).toHaveBeenCalledWith(mockBook);
        });

        it('should handle get book by id error', async () => {
            const mockError = { statusCode: 500, message: "Internal Server Error" };
            mockRequest.params = { id: '1' };
            (bookService.getOneById as jest.Mock).mockRejectedValue(mockError);

            await getOneById(mockRequest as Request, mockResponse as Response);

            expect(bookService.getOneById).toHaveBeenCalledWith('1');
            expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
            expect(mockResponse.json).toHaveBeenCalledWith(mockError);
        });
    });

    describe('updateOneById', () => {
        it('should update a book by id successfully', async () => {
            const mockBook = { id: 1, title: "Updated Book", author: "Updated Author" };
            mockRequest.params = { id: '1' };
            mockRequest.body = { title: "Updated Book", author: "Updated Author" };
            (bookService.updateOneById as jest.Mock).mockResolvedValue(mockBook);

            await updateOneById(mockRequest as Request, mockResponse as Response);

            expect(bookService.updateOneById).toHaveBeenCalledWith('1', mockRequest.body, mockRequest.file);
            expect(mockResponse.json).toHaveBeenCalledWith(mockBook);
        });

        it('should handle update book by id error', async () => {
            const mockError = { statusCode: 500, message: "Internal Server Error" };
            mockRequest.params = { id: '1' };
            mockRequest.body = { title: "Updated Book", author: "Updated Author" };
            (bookService.updateOneById as jest.Mock).mockRejectedValue(mockError);

            await updateOneById(mockRequest as Request, mockResponse as Response);

            expect(bookService.updateOneById).toHaveBeenCalledWith('1', mockRequest.body, mockRequest.file);
            expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
            expect(mockResponse.json).toHaveBeenCalledWith(mockError);
        });
    });

    describe('addGenre', () => {
        it('should add a genre to a book successfully', async () => {
            const mockBook = { id: 1, title: "Test Book", author: "Test Author", genres: ["New Genre"] };
            mockRequest.params = { id: '1' };
            mockRequest.body = { genre: "New Genre" };
            (bookService.addGenre as jest.Mock).mockResolvedValue(mockBook);

            await addGenre(mockRequest as Request, mockResponse as Response);

            expect(bookService.addGenre).toHaveBeenCalledWith('1', "New Genre");
            expect(mockResponse.json).toHaveBeenCalledWith(mockBook);
        });

        it('should handle add genre to book error', async () => {
            const mockError = { statusCode: 500, message: "Internal Server Error" };
            mockRequest.params = { id: '1' };
            mockRequest.body = { genre: "New Genre" };
            (bookService.addGenre as jest.Mock).mockRejectedValue(mockError);

            await addGenre(mockRequest as Request, mockResponse as Response);

            expect(bookService.addGenre).toHaveBeenCalledWith('1', "New Genre");
            expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
            expect(mockResponse.json).toHaveBeenCalledWith(mockError);
        });
    });

    describe('getAllByGenre', () => {
        it('should get all books by genre successfully', async () => {
            const mockBooks = [
                { id: 1, title: "Test Book 1", author: "Test Author 1", genres: ["Test Genre"] },
                { id: 2, title: "Test Book 2", author: "Test Author 2", genres: ["Test Genre"] }
            ];
            mockRequest.params = { genre: 'Test Genre' };
            (bookService.getAllByGenre as jest.Mock).mockResolvedValue(mockBooks);

            await getAllByGenre(mockRequest as Request, mockResponse as Response);

            expect(bookService.getAllByGenre).toHaveBeenCalledWith('Test Genre');
            expect(mockResponse.json).toHaveBeenCalledWith(mockBooks);
        });

        it('should handle get all books by genre error', async () => {
            const mockError = { statusCode: 500, message: "Internal Server Error" };
            mockRequest.params = { genre: 'Test Genre' };
            (bookService.getAllByGenre as jest.Mock).mockRejectedValue(mockError);

            await getAllByGenre(mockRequest as Request, mockResponse as Response);

            expect(bookService.getAllByGenre).toHaveBeenCalledWith('Test Genre');
            expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
            expect(mockResponse.json).toHaveBeenCalledWith(mockError);
        });
    });

    describe('deleteOneById', () => {
        it('should delete a book by id successfully', async () => {
            const mockResponseMessage = { message: "Book deleted successfully" };
            mockRequest.params = { id: '1' };
            (bookService.deleteOneById as jest.Mock).mockResolvedValue(mockResponseMessage);

            await deleteOneById(mockRequest as Request, mockResponse as Response);

            expect(bookService.deleteOneById).toHaveBeenCalledWith('1');
            expect(mockResponse.json).toHaveBeenCalledWith(mockResponseMessage);
        });

        it('should handle delete book by id error', async () => {
            const mockError = { statusCode: 500, message: "Internal Server Error" };
            mockRequest.params = { id: '1' };
            (bookService.deleteOneById as jest.Mock).mockRejectedValue(mockError);

            await deleteOneById(mockRequest as Request, mockResponse as Response);

            expect(bookService.deleteOneById).toHaveBeenCalledWith('1');
            expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
            expect(mockResponse.json).toHaveBeenCalledWith(mockError);
        });
    });
});