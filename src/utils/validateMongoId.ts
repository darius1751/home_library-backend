import { Types } from 'mongoose'
export const validateMongoId = (value: string) => {
    const isValid = Types.ObjectId.isValid(value);
    if (!isValid)
        throw {
            statusCode: 400,
            message: `${value} not is valid mongoID`
        }
}