import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { sign } from "jsonwebtoken";
import { login, updateOne, getOneById } from "../controllers/auth.controller";

describe('Auth controller', () => {
    it('should login', async () => {
        const mockRequest = {} as Request;
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;
        await login(mockRequest, mockResponse);
        expect(mockResponse.json).toHaveBeenCalledTimes(1);
    });
});
jest.mock("../services/auth.service");
jest.mock("jsonwebtoken");


describe('Auth controller', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseObject: any;

    beforeEach(() => {
        mockRequest = {
            body: {
                user: "testUser",
                password: "testPassword"
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

    it('should login successfully', async () => {
        const mockUser = { id: 1, name: "Test User", toJSON: jest.fn().mockReturnValue({ id: 1, name: "Test User" }) };
        (authService.login as jest.Mock).mockResolvedValue(mockUser);
        (sign as jest.Mock).mockReturnValue("mockToken");

        await login(mockRequest as Request, mockResponse as Response);

        expect(authService.login).toHaveBeenCalledWith(mockRequest.body);
        expect(sign).toHaveBeenCalledWith(
            { id: mockUser.id, name: mockUser.name, username: mockRequest.body.user },
            process.env.JWT_SECRET || '',
            { expiresIn: '1h' }
        );
        expect(mockResponse.json).toHaveBeenCalledWith({ user: { ...mockUser.toJSON(), username: mockRequest.body.user }, token: "mockToken" });
    });

    it('should create a token during login', async () => {
        const mockUser = { id: 1, name: "Test User", toJSON: jest.fn().mockReturnValue({ id: 1, name: "Test User" }) };
        (authService.login as jest.Mock).mockResolvedValue(mockUser);
        (sign as jest.Mock).mockReturnValue("mockToken");

        await login(mockRequest as Request, mockResponse as Response);

        expect(sign).toHaveBeenCalledWith(
            { id: mockUser.id, name: mockUser.name, username: mockRequest.body.user },
            process.env.JWT_SECRET || '',
            { expiresIn: '1h' }
        );
    });

    it('should handle login error', async () => {
        const mockError = { statusCode: 401, message: "Unauthorized" };
        (authService.login as jest.Mock).mockRejectedValue(mockError);

        await login(mockRequest as Request, mockResponse as Response);

        expect(authService.login).toHaveBeenCalledWith(mockRequest.body);
        expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
        expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });

    describe('updateOne', () => {
        beforeEach(() => {
            mockRequest = {
                params: {
                    id: "1"
                },
                body: {
                    user: "updatedUser",
                    password: "updatedPassword"
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

        it('should update user successfully', async () => {
            const mockUpdatedUser = { id: 1, user: "updatedUser", password: "updatedPassword" };
            (authService.updateOne as jest.Mock).mockResolvedValue(mockUpdatedUser);

            await updateOne(mockRequest as Request, mockResponse as Response);

            expect(authService.updateOne).toHaveBeenCalledWith(mockRequest.params?.id , mockRequest.body);
            expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedUser);
        });

        it('should handle update error', async () => {
            const mockError = { statusCode: 400, message: "Bad Request" };
            (authService.updateOne as jest.Mock).mockRejectedValue(mockError);

            await updateOne(mockRequest as Request, mockResponse as Response);

            expect(authService.updateOne).toHaveBeenCalledWith(mockRequest.params?.id, mockRequest.body);
            expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
            expect(mockResponse.json).toHaveBeenCalledWith(mockError);
        });
    });

    describe('getOneById', () => {
        beforeEach(() => {
            mockRequest = {
                params: {
                    id: "1"
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

        it('should get user by id successfully', async () => {
            const mockUser = { id: 1, name: "Test User" };
            (authService.getOneById as jest.Mock).mockResolvedValue(mockUser);

            await getOneById(mockRequest as Request, mockResponse as Response);

            expect(authService.getOneById).toHaveBeenCalledWith(mockRequest.params?.id);
            expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
        });

        it('should handle get user by id error', async () => {
            const mockError = { statusCode: 404, message: "User not found" };
            (authService.getOneById as jest.Mock).mockRejectedValue(mockError);

            await getOneById(mockRequest as Request, mockResponse as Response);

            expect(authService.getOneById).toHaveBeenCalledWith(mockRequest.params?.id);
            expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
            expect(mockResponse.json).toHaveBeenCalledWith(mockError);
        });
    });
});