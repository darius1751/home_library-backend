import { compare, hash } from "bcrypt";
import { Credential } from "../interfaces/credential"
import { authModel } from "../models/credential.model"
import { userService } from "./user.service";

const createOne = async ({ user, password }: Credential) => {
    try {
        const existUser = await existsUser(user);
        if (existUser) {
            throw {
                statusCode: 400,
                message: `user: ${user} exists in DB`
            }
        }
        const newPassword = await hash(password, 10);
        const auth = await authModel.create({ user, password: newPassword });
        return auth._id;
    } catch (error) {
        throw error;
    }
}

const updateOne = async (id: string, { user, password }: Credential) => {
    try {
        const newPassword = await hash(password, 10);
        return await authModel.findByIdAndUpdate(id, { user, password: newPassword });
    } catch (error) {
        throw error;
    }
}

const getOneByUser = async (user: string) => {
    try {
        const credential = await authModel.findOne({ user })
        console.log(credential);
        return(credential)
    } catch (error) {
        throw error;
    }
    
}
const login = async ({ user, password }: Credential) => {
    try {
        const auth = await authModel.findOne({ user });
        if (!auth) {
            throw {
                statusCode: 400,
                message: `Not exist user: ${user}`
            }
        }
        const isValid = await compare(password, auth.password);
        if (isValid)
            return await userService.getOneByCredentialId(auth.id);
        else
            throw {
                statusCode: 400,
                message: `Error in auth`
            }
    } catch (error) {
        throw error;
    }
}
export const existsUser = async (user: string) => !!await authModel.exists({ user });

export const authService = { login, createOne, updateOne, getOneByUser }