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
        required: true
    }
}, { timestamps: true, versionKey: false });


export const authModel = model('credentials', AuthSchema);