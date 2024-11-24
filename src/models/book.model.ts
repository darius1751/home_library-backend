import { model, Schema,  Types } from "mongoose";


const BookSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        minLength: [3, 'Title must be at least 3 characters long'],    
    },
    author: {
        type: String,
        required: [true, 'Author is required'],
        minLength: [3, 'Author must be at least 3 characters long']
    },
    summary: {
        type: String,
        required: [true, 'Summary is required'],
        minLength: [10, 'Summary must be at least 10 characters long']
    },
    image: {
        type: String,
        // required: true
    },
    genres: {
        type: [String],
    },
    user: {
        type: String,
        ref: 'users',
        required: [true, 'User is required']
    },
    location: {
        type: String,
        enum: ['library', 'lent', 'wishlist'],
        required: [true, 'Location is required']
    },
    state: {
        type: String,
        enum: ['read', 'currently reading', 'unread', 'not finished'],
        required: [true, 'State is required']
    }
   
}, { timestamps: true, versionKey: false });
const Book = model('Book', BookSchema);

export default Book

