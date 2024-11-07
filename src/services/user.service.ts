import { userModel } from "../models/user.model"


export const getOneByCredentialId = async (credentialId: string) => {
    try {
        const user = await userModel.findOne({ credential_id: credentialId }, { credential_id: false });
        if (!user)
            throw {
                statusCode: 400,
                message: `Not exists user with credentialId: ${credentialId}`
            }
        return user;
    } catch (error) {
        throw error;
    }
}
export const userService = { getOneByCredentialId }