import { Credential } from "./credential";

export interface CreateUserDto {
    name: string;
    email: string;
    photo: string;
    birthday: string;
    credential: Credential;
}