import { avatarService } from "../services/avatar.service"
import { cloudinary } from "../config/cloudinary.config";

jest.mock("../config/cloudinary.config", () => ({
    cloudinary: {
        api: {
            resources_by_asset_folder: jest.fn()
        }
    }
}));

describe('Avatar service - getAll', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should get all avatars successfully', async () => {
        const mockData = {
            resources: [
                { secure_url: "https://example.com/avatar1.jpg" },
                { secure_url: "https://example.com/avatar2.jpg" }
            ]
        };
        (cloudinary.api.resources_by_asset_folder as jest.Mock).mockResolvedValue(mockData);

        const result = await avatarService.getAll();

        expect(cloudinary.api.resources_by_asset_folder).toHaveBeenCalledWith('avatars', { resource_type: 'Image', max_results: 100 });
        expect(result).toEqual(["https://example.com/avatar1.jpg", "https://example.com/avatar2.jpg"]);
    });

    it('should handle errors', async () => {
        const mockError = new Error("Internal Server Error");
        (cloudinary.api.resources_by_asset_folder as jest.Mock).mockRejectedValue(mockError);

        await expect(avatarService.getAll()).rejects.toThrow(mockError);

        expect(cloudinary.api.resources_by_asset_folder).toHaveBeenCalledWith('avatars', { resource_type: 'Image', max_results: 100 });
    });
});