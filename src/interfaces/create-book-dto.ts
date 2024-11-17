
export default interface CreateBookDto {
    title: string;
    author: string;
    summary: string;
    genres: string[];
    user: string,
    location: string;
    state: string;
}