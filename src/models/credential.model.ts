import { model, Schema } from "mongoose";

export const AuthSchema = new Schema({
    user: {
        type: String,
        minLength: 5,
        unique: true,
        required: true
    },
    password: {
        type: String,
        minLength: 8,
        required: true,
    },
    email: {
        type: String,
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
        required: true
    }
}, { timestamps: true, versionKey: false });


export const authModel = model('credentials', AuthSchema);