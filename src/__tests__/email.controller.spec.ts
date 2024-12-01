import { Request, Response } from "express";
import { userService } from "../services/user.service";
import { sendBookEmail, sendPasswordEmail, sendWelcomeEmail } from "../controllers/email.controller";
import { transport } from "../config/email.config"
import { sign } from "jsonwebtoken";

jest.mock("../services/user.service", () => ({
    userService: {
        getOneByEmail: jest.fn()
    }
}));

jest.mock("../config/email.config", () => ({
    transport: {
        sendMail: jest.fn()
    }
}));

jest.mock("jsonwebtoken", () => ({
    sign: jest.fn()
}));

afterEach(() => {
    jest.clearAllMocks();
});

afterAll(() => {
    jest.resetAllMocks();
});

describe('Email controller', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseObject: any;

    beforeEach(() => {
        process.env.JWT_SECRET = "testSecret";
        mockRequest = {
            body: {
                email: "test@example.com",
                name: "Test User",
                id: "1",
                token: "testToken",
                sender: "sender@example.com",
                receiver: "receiver@example.com",
                friend: "Friend",
                lastname: "User"
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

    describe('sendBookEmail', () => {
        it('should send a book email successfully', async () => {
            const mockEmailResponse = { message: "Email sent successfully", status: 200 };
            (transport.sendMail as jest.Mock).mockResolvedValue(mockEmailResponse);

            await sendBookEmail(mockRequest as Request, mockResponse as Response, jest.fn());
            expect(transport.sendMail).toHaveBeenCalledWith({
                "cc": "sender@example.com",
                "from": "Test User User <sender@example.com>",
                "subject": "Test User User sent you their book list",
                "text": `Hi Friend! \n\n Here are all the books in my library. You can see what books I have and what books are in my wishlist. \n\n Click the link below to see the list: \n\n http://localhost:3000/books/1 \n\n Love, Test User`,
                "to": "receiver@example.com",
            });
            expect(mockResponse.json).toHaveBeenCalledWith(mockEmailResponse);
        });

        it('should handle send book email error', async () => {
            const mockError = { statusCode: 500, message: "Internal Server Error" };
            (transport.sendMail as jest.Mock).mockRejectedValue(mockError);

            await sendBookEmail(mockRequest as Request, mockResponse as Response, jest.fn());
            expect(transport.sendMail).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
            expect(mockResponse.json).toHaveBeenCalledWith(mockError);
        });
    });

    describe('sendPasswordEmail', () => {
        it('should send a password email successfully and create a token', async () => {
            const mockEmailResponse = { message: "Email sent successfully", status: 200 };
          const mockToken = "mockToken";
        const mockUser = { id: "1", name: "Test User" };
          (sign as jest.Mock).mockReturnValue(mockToken);
          (transport.sendMail as jest.Mock).mockResolvedValue(mockEmailResponse);
          (userService.getOneByEmail as jest.Mock).mockResolvedValue(mockUser);
      
          await sendPasswordEmail(mockRequest as Request, mockResponse as Response);
      
          expect(sign).toHaveBeenCalledWith(
            { id: mockUser.id, name: mockUser.name },
            process.env.JWT_SECRET,
            { expiresIn: '5m' }
          );
          expect(transport.sendMail).toHaveBeenCalledWith({
            from: `Home Library <${process.env.EMAIL_USER}>`,
            to: mockRequest.body.email,
            subject: 'Password Reset',
            text: `Hi ${mockUser.name}! \n\n Click the link below to reset your password: \n\n http://localhost:3000/reset-password/${mockUser.id}?token=${mockToken} \n\n Love, Home Library`
          });
        });
      

        it('should handle send password email error', async () => {
            const mockError = { statusCode: 500, message: "Internal Server Error" };
            (transport.sendMail as jest.Mock).mockRejectedValue(mockError);

            await sendPasswordEmail(mockRequest as Request, mockResponse as Response);

            expect(transport.sendMail).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
            expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
})

    describe('sendWelcomeEmail', () => {
        it('should send a welcome email successfully', async () => {
            const mockUser = { name: "Test User" };
            const mockEmailResponse = { message: "Email sent successfully", status: 200 };
            (userService.getOneByEmail as jest.Mock).mockResolvedValue(mockUser);
            (transport.sendMail as jest.Mock).mockResolvedValue(mockEmailResponse);

            await sendWelcomeEmail(mockRequest as Request, mockResponse as Response);

            expect(userService.getOneByEmail).toHaveBeenCalledWith(mockRequest.body.email);
            expect(transport.sendMail).toHaveBeenCalledWith({
                from: `Home Library <${process.env.EMAIL_USER}>`,
                to: mockRequest.body.email,
                subject: 'Welcome to Home Library',
                text: expect.stringContaining(mockUser.name)
            });
            expect(mockResponse.json).toHaveBeenCalledWith(mockEmailResponse);
        });

        it('should handle send welcome email error', async () => {
            const mockError = { statusCode: 500, message: "Internal Server Error" };
            (userService.getOneByEmail as jest.Mock).mockRejectedValue(mockError);

            await sendWelcomeEmail(mockRequest as Request, mockResponse as Response);

            expect(userService.getOneByEmail).toHaveBeenCalledWith(mockRequest.body.email);
            expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
            expect(mockResponse.json).toHaveBeenCalledWith(mockError);
        });
    });
});