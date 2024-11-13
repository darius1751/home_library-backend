import { model, Schema,  Types } from "mongoose";


const BookSchema = new Schema({
    title: {
        type: String,
        required: true,
        minLength: [3, 'Title must be at least 3 characters long'],    
    },
    author: {
        type: String,
        required: true,
        minLength: [3, 'Author must be at least 3 characters long']
    },
    summary: {
        type: String,
        required: true,
        minLength: [10, 'Summary must be at least 10 characters long']
    },
    image: {
        type: String,
        // required: true
    },
    genre: {
        type: [String],
    },
    user: {
        type: String,
        ref: 'users',
        required: true
    },
    location: {
        type: String,
        enum: ['library', 'lent', 'wishlist'],
        required: true
    },
    state: {
        type: String,
        enum: ['read', 'currently reading', 'unread', 'not finished'],
        required: true
    }
   
}, { timestamps: true, versionKey: false });
const Book = model('Book', BookSchema);

export default Book

