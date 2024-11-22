import { CreateUserDto } from "../interfaces/create-user-dto";
import { userModel } from "../models/user.model"
import { authService } from "./auth.service";


const getAll = async () => {
    try {
        return await userModel.find();
    } catch (error) {
        throw error;
    }
}
const getOneById = async (id: string) => {
    try {
        const user = await userModel.findById(id);
        if (!user) {
            throw {
                statusCode: 400,
                message: `Not exist user with id: ${id}`
            }
        }
        return user;
    } catch (error) {
        throw error;
    }
}


const getOneByCredentialId = async (credentialId: string) => {
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

const createOne = async (createUserDto: CreateUserDto) => {
    try {
        const { email, credential, ...newUser } = createUserDto;
        const existEmail = await existsEmail(email);
        if (existEmail) {
            throw {
                statusCode: 400,
                message: `Error in create user, exists email: ${email}`
            }
        }
        const { id: credentialId , user: username} = await authService.createOne(credential);
        const { id } = await userModel.create({ ...newUser, email, credential_id: credentialId, username });
        return await userModel.findById(id, { credential_id: false });
    } catch (error) {
        throw error;
    }
}

const existsEmail = async (email: string) => {
    return !!await userModel.exists({ email });
}

const getOneByEmail = async (email: string) => {
    try {
        return await userModel.findOne({ email });
    } catch (error) {
        throw error;
    }
}
export const userService = { getOneByCredentialId, createOne, getAll, getOneById, getOneByEmail }