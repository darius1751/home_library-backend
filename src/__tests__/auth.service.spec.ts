import { authService } from "../services/auth.service";
import { authModel } from "../models/credential.model";
import {userService} from "../services/user.service";
import bcrypt from "bcrypt";

jest.mock("../models/credential.model", () => ({
    authModel: {
        create: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findById: jest.fn(),
        findOne: jest.fn(),
        exists: jest.fn()
    }
}));

jest.mock("jsonwebtoken", () => ({
    sign: jest.fn()
}));

jest.mock("../services/user.service", () => ({
    userService: {
        getOneByCredentialId: jest.fn()
    }
}));

jest.mock("bcrypt", () => ({
    hash: jest.fn(),
    compare: jest.fn()
}));

describe('Auth service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createOne', () => {
        it('should create a user successfully', async () => {
            const mockUser = { id: 1, user: "testuser", password: "hashedPassword" };
            (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
            (authModel.create as jest.Mock).mockResolvedValue(mockUser);

            const result = await authService.createOne({ user: "testuser", password: "password123" });

            expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
            expect(authModel.create).toHaveBeenCalledWith({ user: "testuser", password: "hashedPassword" });
            expect(result).toEqual(mockUser.id);
        });

        it('should handle create user error', async () => {
            const mockError = new Error("Internal Server Error");
            (bcrypt.hash as jest.Mock).mockRejectedValue(mockError);

            await expect(authService.createOne({ user: "testuser", password: "password123" })).rejects.toThrow(mockError);
        });
    });

    describe('updateOne', () => {
        it('should update a user successfully', async () => {
            const mockUser = { id: 1, user: "testuser", password: "newHashedPassword" };
            (bcrypt.hash as jest.Mock).mockResolvedValue("newHashedPassword");
            (authModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUser);

            const result = await authService.updateOne(mockUser.id.toString(), {user: "testuser", password: "newPassword123" });

            expect(bcrypt.hash).toHaveBeenCalledWith("newPassword123", 10);
            expect(authModel.findByIdAndUpdate).toHaveBeenCalledWith(mockUser.id.toString(), { $set: { password: "newHashedPassword" } }, { new: true });
            expect(result).toEqual(mockUser);
        });

        it('should handle update user error', async () => {
            const mockError = new Error("Internal Server Error");
            (bcrypt.hash as jest.Mock).mockRejectedValue(mockError);

            await expect(authService.updateOne("1", {user: "testuser", password: "newPassword123" })).rejects.toThrow(mockError);
        });
    });

    describe('getOneById', () => {
        it('should get a user by id successfully', async () => {
            const mockUser = { id: 1, user: "testuser", password: "hashedPassword" };
            (authModel.findById as jest.Mock).mockResolvedValue(mockUser);

            const result = await authService.getOneById(mockUser.id.toString());

            expect(authModel.findById).toHaveBeenCalledWith(mockUser.id.toString());
            expect(result).toEqual(mockUser);
        });

        it('should handle get user by id error', async () => {
            const mockError = new Error("Internal Server Error");
            (authModel.findById as jest.Mock).mockRejectedValue(mockError);

            await expect(authService.getOneById("1")).rejects.toThrow(mockError);
        });
    });

    describe('login', () => {
        it('should login a user successfully and return user details', async () => {
            const mockUser = { id: 1, user: "testuser", password: "hashedPassword" };
            const mockUserDetails = { id: 1, name: "Test User", email: "test@example.com" };
            (authModel.findOne as jest.Mock).mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (userService.getOneByCredentialId as jest.Mock).mockResolvedValue(mockUserDetails);
    
            const result = await authService.login({ user: "testuser", password: "password123" });
    
            expect(authModel.findOne).toHaveBeenCalledWith({ user: "testuser" });
            expect(bcrypt.compare).toHaveBeenCalledWith("password123", "hashedPassword");
            expect(userService.getOneByCredentialId).toHaveBeenCalledWith(mockUser.id);
            expect(result).toEqual(mockUserDetails);
        });

        it('should handle login error', async () => {
            const mockError = new Error("Internal Server Error");
            (authModel.findOne as jest.Mock).mockRejectedValue(mockError);

            await expect(authService.login({ user: "testuser", password: "password123" })).rejects.toThrow(mockError);
        });
    });
});