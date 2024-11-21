import { cloudinary } from "../config/cloudinary.config";

export const getAll = async () => {

    try {
        const data = await cloudinary.api.resources_by_asset_folder('avatars');
        const avatars = data.resources.map(({ secure_url }) => secure_url);
        return avatars;
    } catch (error) {
        console.log(`Error`, { error });
        throw error;
    }
}
export const avatarService = { getAll }