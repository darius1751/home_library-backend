import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { validateJWT, validateResetJWT } from "../middlewares/validateJWT.middleware";

jest.mock("jsonwebtoken", () => ({
    verify: jest.fn()
}));

afterEach(() => {
    jest.clearAllMocks();
});

afterAll(() => {
    jest.resetAllMocks();
});

describe('validateJWT middleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;
    let responseObject: any;

    beforeEach(() => {
        mockRequest = {
            headers: {}
        };
        responseObject = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockImplementation((result) => {
                responseObject = result;
            })
        } as Partial<Response>;
        mockNext = jest.fn();
    });

    beforeAll(() => {
        process.env.JWT_SECRET = 'testSecret';
    });

    describe('validateJWT', () => {
        it('should call next if token is valid', async () => {
            mockRequest.headers = { token: "validToken" };
            (verify as jest.Mock).mockImplementation((token, secret) => {});

            await validateJWT(mockRequest as Request, mockResponse as Response, mockNext);

            expect(verify).toHaveBeenCalledWith("validToken", process.env.JWT_SECRET || '');
            expect(mockNext).toHaveBeenCalled();
            expect(mockNext).toHaveBeenCalled();
        });

        it('should return 402 if token is missing', async () => {
            await validateJWT(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(402);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: `Token is required` });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 401 if token is invalid', async () => {
            mockRequest.headers = { token: "invalidToken" };
            const mockError = new Error("Invalid token");
            (verify as jest.Mock).mockImplementation((token, secret) => {
                throw mockError;
            });
        
            await validateJWT(mockRequest as Request, mockResponse as Response, mockNext);
        
            expect(verify).toHaveBeenCalledWith("invalidToken", process.env.JWT_SECRET || '');
            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith(mockError);
            expect(mockNext).not.toHaveBeenCalled();
        });
    });

    describe('validateResetJWT', () => {
        beforeEach(() => {
            mockRequest.query = {};
        });

        it('should call next if token is valid', async () => {
            mockRequest.query = { token: "validToken" };
            (verify as jest.Mock).mockImplementation((token, secret) => {});

            await validateResetJWT(mockRequest as Request, mockResponse as Response, mockNext);

            expect(verify).toHaveBeenCalledWith("validToken", process.env.JWT_SECRET || '');
            expect(mockNext).toHaveBeenCalled();
        });

        it('should return 402 if token is missing', async () => {
            await validateResetJWT(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(402);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: `Token is required` });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 401 if token is invalid', async () => {
            mockRequest.query = { token: "invalidToken" };
            const mockError = new Error("Invalid token");
            (verify as jest.Mock).mockImplementation((token, secret) => {
                throw mockError;
            });
        
            await validateResetJWT(mockRequest as Request, mockResponse as Response, mockNext);
        
            expect(verify).toHaveBeenCalledWith("invalidToken", process.env.JWT_SECRET || '');
            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith(mockError);
            expect(mockNext).not.toHaveBeenCalled();
        });
    });
});