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
        return auth.id;
    } catch (error) {
        throw error;
    }
}

const updateOne = async (id: string, { user, password }: Credential) => {
    try {
        const newPassword = await hash(password, 10);
        return await authModel.findByIdAndUpdate(id, { $set: { password: newPassword } }, { new: true });
    } catch (error) {
        throw error;
    }
}

const getOneById = async (id: string) => {
    try {
        return await authModel.findById(id);
    } catch (error) {
        throw error;
    }
}
const login = async ({ user, password }: Credential) => {
    try {
        const currentUser = await authModel.findOne({ user })
        if (!currentUser) {
            throw {
                statusCode: 400,
                message: `Not exist user: ${user}`
            }
        }
        const isValid = await compare(password, currentUser.password);
        if (isValid)
            return await userService.getOneByCredentialId(currentUser.id);
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

export const authService = { login, createOne, updateOne, getOneById }