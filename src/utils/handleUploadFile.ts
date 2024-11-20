import { v2 as cloudinary } from 'cloudinary'
type FileData = {
    filename: string;
    mimetype: string;
    buffer: Buffer;
    isAvatar?: boolean
}

export const handleUploadFile = async ({ filename, mimetype, buffer, isAvatar }: FileData) => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        })
        const base64 = Buffer.from(buffer).toString('base64');
        const imageURI = `data:${mimetype};base64,${base64}`;
        const ext = mimetype.split('/')[1].split('+')[0];
        console.log({ file: `${filename}.${ext}` });
        const folder = isAvatar ? `homelibrary/avatars/` : `homelibrary/${filename}/books`;
        const { secure_url } = await cloudinary.uploader.upload(imageURI, {
            resource_type: 'auto',
            filename_override: `${filename}.${ext}`,
            use_filename: true,
            folder,
        });
        return secure_url;
    } catch (error: any) {
        console.log({ error });
        throw {
            statusCode: 500,
            error
        }
    }

}

