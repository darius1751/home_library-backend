export const validateFile = (mimetype: string, size: number) => {
    console.log({ mimetype, size });
    if (!mimetype.includes('image/') || size / 1000 > 2000) {
        throw {
            statusCode: 400,
            message: `the file must be 2MB maximum and image format`
        }
    }
}