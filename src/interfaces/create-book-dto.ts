
export default interface CreateBookDto {
    title: string;
    author: string;
    summary: string;
    genre: string[];
    user: string,
    location: string;
    state: string;
}