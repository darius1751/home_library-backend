import { userService } from "../services/user.service";
import { userModel } from "../models/user.model";
import { authService } from "../services/auth.service";
import { CreateUserDto } from "../interfaces/create-user-dto";

jest.mock("../models/user.model", () => ({
    userModel: {
        find: jest.fn(),
        findById: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        exists: jest.fn()
    }
}));

jest.mock("../services/auth.service", () => ({
    authService: {
        createOne: jest.fn()
    }
}));

describe('User service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAll', () => {
        it('should get all users successfully', async () => {
            const mockUsers = [{ id: "1", name: "Test User 1" }, { id: "2", name: "Test User 2" }];
            (userModel.find as jest.Mock).mockResolvedValue(mockUsers);

            const result = await userService.getAll();

            expect(userModel.find).toHaveBeenCalled();
            expect(result).toEqual(mockUsers);
        });

        it('should handle get all users error', async () => {
            const mockError = new Error("Internal Server Error");
            (userModel.find as jest.Mock).mockRejectedValue(mockError);

            await expect(userService.getAll()).rejects.toThrow(mockError);
        });
    });

    describe('getOneById', () => {
        it('should get a user by id successfully', async () => {
            const mockUser = { id: "1", name: "Test User" };
            (userModel.findById as jest.Mock).mockResolvedValue(mockUser);

            const result = await userService.getOneById("1");

            expect(userModel.findById).toHaveBeenCalledWith("1");
            expect(result).toEqual(mockUser);
        });

        it('should handle user not found', async () => {
            (userModel.findById as jest.Mock).mockResolvedValue(null);

            await expect(userService.getOneById("1")).rejects.toEqual({
                statusCode: 400,
                message: `Not exist user with id: 1`
            });

            expect(userModel.findById).toHaveBeenCalledWith("1");
        });

        it('should handle get user by id error', async () => {
            const mockError = new Error("Internal Server Error");
            (userModel.findById as jest.Mock).mockRejectedValue(mockError);

            await expect(userService.getOneById("1")).rejects.toThrow(mockError);
        });
    });

    describe('getOneByCredentialId', () => {
        it('should get a user by credential id successfully', async () => {
            const mockUser = { id: "1", name: "Test User", credential_id: "123" };
            (userModel.findOne as jest.Mock).mockResolvedValue(mockUser);

            const result = await userService.getOneByCredentialId("123");

            expect(userModel.findOne).toHaveBeenCalledWith({ credential_id: "123" }, { credential_id: false });
            expect(result).toEqual(mockUser);
        });

        it('should handle user not found by credential id', async () => {
            (userModel.findOne as jest.Mock).mockResolvedValue(null);

            await expect(userService.getOneByCredentialId("123")).rejects.toEqual({
                statusCode: 400,
                message: `Not exists user with credentialId: 123`
            });

            expect(userModel.findOne).toHaveBeenCalledWith({ credential_id: "123" }, { credential_id: false });
        });

        it('should handle get user by credential id error', async () => {
            const mockError = new Error("Internal Server Error");
            (userModel.findOne as jest.Mock).mockRejectedValue(mockError);

            await expect(userService.getOneByCredentialId("123")).rejects.toThrow(mockError);
        });
    });

    describe('createOne', () => {
        it('should create a user successfully', async () => {
            const mockUser = { id: "1", name: "Test User", email: "test@example.com" };
            const mockCredential = { user: "testuser", password: "password123" };
            const createUserDto: CreateUserDto = { name: "Test User", email: "test@example.com", credential: mockCredential, photo: "test.jpg", birthday: "01/01/2000" };
            (userModel.exists as jest.Mock).mockResolvedValue(false);
            (authService.createOne as jest.Mock).mockResolvedValue("credential_id");
            (userModel.create as jest.Mock).mockResolvedValue({ id: "1" });
            (userModel.findById as jest.Mock).mockResolvedValue(mockUser);

            const result = await userService.createOne(createUserDto);

            expect(userModel.exists).toHaveBeenCalledWith({ email: "test@example.com" });
            expect(authService.createOne).toHaveBeenCalledWith(mockCredential);
            expect(userModel.create).toHaveBeenCalledWith({ name: "Test User", email: "test@example.com", credential_id: "credential_id", photo: "test.jpg", birthday: "01/01/2000" });
            expect(userModel.findById).toHaveBeenCalledWith("1", { credential_id: false });
            expect(result).toEqual(mockUser);
        });

        it('should handle email already exists error', async () => {
            const mockCredential = { user: "testuser", password: "password123" };
            const createUserDto: CreateUserDto = { name: "Test User", email: "test@example.com", credential: mockCredential, photo: "test.jpg", birthday: "01/01/2000" };
            (userModel.exists as jest.Mock).mockResolvedValue(true);

            await expect(userService.createOne(createUserDto)).rejects.toEqual({
                statusCode: 400,
                message: `Error in create user, email exists: test@example.com`
            });

            expect(userModel.exists).toHaveBeenCalledWith({ email: "test@example.com" });
        });

        it('should handle create user error', async () => {
            const mockCredential = { user: "testuser", password: "password123" };
            const createUserDto: CreateUserDto = { name: "Test User", email: "test@example.com", credential: mockCredential, photo: "test.jpg", birthday: "01/01/2000" };
            const mockError = new Error("Internal Server Error");
            (userModel.exists as jest.Mock).mockResolvedValue(false);
            (authService.createOne as jest.Mock).mockRejectedValue(mockError);

            await expect(userService.createOne(createUserDto)).rejects.toThrow(mockError);

            expect(userModel.exists).toHaveBeenCalledWith({ email: "test@example.com" });
            expect(authService.createOne).toHaveBeenCalledWith(mockCredential);
        });
    });
});