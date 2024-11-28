import { Request, Response } from "express";
import { userService } from "../../services/user.service";
import { createOne, getAll, getOneById, getOneByEmail } from "../../controllers/user.controller";
import { validateMongoId } from "../../utils/validateMongoId";

jest.mock("../../services/user.service", () => ({
    userService: {
        createOne: jest.fn(),
        getAll: jest.fn(),
        getOneById: jest.fn(),
        getOneByEmail: jest.fn()
    }
}));

jest.mock("../../utils/validateMongoId", () => ({
    validateMongoId: jest.fn()
}));


describe('User controller', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseObject: any;

    beforeEach(() => {
        mockRequest = {
            body: {
                name: "Test User",
                email: "test@example.com",
                password: "password123"
            },
            params: {
                id: "1",
                email: "test@example.com"
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
        it('should create a user successfully', async () => {
            const mockUser = { id: 1, name: "Test User", email: "test@example.com" };
            (userService.createOne as jest.Mock).mockResolvedValue(mockUser);

            await createOne(mockRequest as Request, mockResponse as Response);

            expect(userService.createOne).toHaveBeenCalledWith(mockRequest.body);
            expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
        });

        it('should handle create user error', async () => {
            const mockError = { statusCode: 500, message: "Internal Server Error" };
            (userService.createOne as jest.Mock).mockRejectedValue(mockError);

            await createOne(mockRequest as Request, mockResponse as Response);

            expect(userService.createOne).toHaveBeenCalledWith(mockRequest.body);
            expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
            expect(mockResponse.json).toHaveBeenCalledWith(mockError);
        });
    });

    describe('getAll', () => {
        it('should get all users successfully', async () => {
            const mockUsers = [
                { id: 1, name: "Test User 1", email: "test1@example.com" },
                { id: 2, name: "Test User 2", email: "test2@example.com" }
            ];
            (userService.getAll as jest.Mock).mockResolvedValue(mockUsers);

            await getAll(mockRequest as Request, mockResponse as Response);

            expect(userService.getAll).toHaveBeenCalled();
            expect(mockResponse.json).toHaveBeenCalledWith(mockUsers);
        });

        it('should handle get all users error', async () => {
            const mockError = { statusCode: 500, message: "Internal Server Error" };
            (userService.getAll as jest.Mock).mockRejectedValue(mockError);

            await getAll(mockRequest as Request, mockResponse as Response);

            expect(userService.getAll).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
            expect(mockResponse.json).toHaveBeenCalledWith(mockError);
        });
    });

    describe('getOneById', () => {
        it('should get a user by id successfully', async () => {
            const mockUser = { id: 1, name: "Test User", email: "test@example.com" };
            (validateMongoId as jest.Mock).mockReturnValue(true);
            (userService.getOneById as jest.Mock).mockResolvedValue(mockUser);

            await getOneById(mockRequest as Request, mockResponse as Response);

            expect(validateMongoId).toHaveBeenCalledWith(mockRequest.params?.id);
            expect(userService.getOneById).toHaveBeenCalledWith(mockRequest.params?.id);
            expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
        });
        it('should handle get user by id error', async () => {
            const mockError = { statusCode: 500, message: "Internal Server Error" };
            (validateMongoId as jest.Mock).mockReturnValue(true);
            (userService.getOneById as jest.Mock).mockRejectedValue(mockError);

            await getOneById(mockRequest as Request, mockResponse as Response);

            expect(validateMongoId).toHaveBeenCalledWith(mockRequest.params?.id);
            expect(userService.getOneById).toHaveBeenCalledWith(mockRequest.params?.id);
            expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
            expect(mockResponse.json).toHaveBeenCalledWith(mockError);
        });
    
         })

         describe('getOneByEmail', () => {

            it('should get a user by email successfully', async () => {
                const mockUser = { id: 1, name: "Test User", email: "test@example.com" };
                (userService.getOneByEmail as jest.Mock).mockResolvedValue(mockUser);
    
                await getOneByEmail(mockRequest as Request, mockResponse as Response);
    
                expect(userService.getOneByEmail).toHaveBeenCalledWith(mockRequest.params?.email);
                expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
            });
    
            it('should handle get user by email error', async () => {
                const mockError = { statusCode: 500, message: "Internal Server Error" };
                (userService.getOneByEmail as jest.Mock).mockRejectedValue(mockError);
    
                await getOneByEmail(mockRequest as Request, mockResponse as Response);
    
                expect(userService.getOneByEmail).toHaveBeenCalledWith(mockRequest.params?.email);
                expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
                expect(mockResponse.json).toHaveBeenCalledWith(mockError);
            });
        });

        
    });

   




