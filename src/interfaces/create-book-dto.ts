import { Types } from "mongoose";

export default interface CreateBookDto {
    title: string;
    author: string;
    summary: string;
    image: string;
    genre: string[];
    user: string,
    location: string;
    state: string;
}