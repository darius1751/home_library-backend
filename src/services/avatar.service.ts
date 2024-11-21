import { cloudinary } from "../config/cloudinary.config";

export const getAll = async () => {
    const avatars: string[] = [];
    let nextCursor = true;
    try {

        while (!!nextCursor) {
            const cursor = await cloudinary.api.resources({ folder: "avatars", max_results: 30 });
            nextCursor = cursor.next_cursor;
            console.log(cursor.resources.secure_url);
            avatars.push(cursor.resources.secure_url);
        }
        return avatars;
    } catch (error) {
        console.log(`Error`, { error });
        throw error;
    }
}
export const avatarService = { getAll }