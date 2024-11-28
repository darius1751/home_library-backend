import { Request, Response } from "express";
import { avatarService } from "../../services/avatar.service";
import { getAll } from "../avatar.controller";

jest.mock("../../services/avatar.service");

describe('Avatar controller', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseObject: any;

    beforeEach(() => {
        mockRequest = {};
        responseObject = {};
        mockResponse = {
            json: jest.fn().mockImplementation((result) => {
                responseObject = result;
            }),
            status: jest.fn().mockReturnThis()
        };
    });

    it('should get all avatars successfully', async () => {
        const mockAvatars = [{ id: 1, name: "Avatar 1" }, { id: 2, name: "Avatar 2" }];
        (avatarService.getAll as jest.Mock).mockResolvedValue(mockAvatars);

        await getAll(mockRequest as Request, mockResponse as Response);

        expect(avatarService.getAll).toHaveBeenCalled();
        expect(mockResponse.json).toHaveBeenCalledWith(mockAvatars);
    });

    it('should handle get all avatars error', async () => {
        const mockError = { statusCode: 500, message: "Internal Server Error" };
        (avatarService.getAll as jest.Mock).mockRejectedValue(mockError);

        await getAll(mockRequest as Request, mockResponse as Response);

        expect(avatarService.getAll).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
        expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
});