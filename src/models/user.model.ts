import { model, Schema, SchemaTypes, Types } from "mongoose";

export const UserSchema = new Schema({

    credential_id: {
        type: Types.ObjectId,
        ref: 'credentials',
        required: true,
        unique: true,
    },
    avatar: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: true,
        minLength: 3
    },
    email: {
        type: String,
        required: true,
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
    },
    birthday: {
        type: SchemaTypes.Date,
        required: true
    }
}, { timestamps: true, versionKey: false });
export const userModel = model('users', UserSchema);
