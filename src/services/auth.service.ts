import { compare } from "bcrypt";
import { Credential } from "../interfaces/credential"
import { authModel } from "../models/credential.model"
import { userService } from "./user.service";

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

export const authService = { login }