import { model, Schema, SchemaTypes, Types } from "mongoose";

export const UserSchema = new Schema({

    credential_id: {
        type: Types.ObjectId,
        ref: 'credentials',
        required: [true, 'Credential is required'],
        unique: [true, 'Credential must be unique']
    },
    avatar: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        minLength: [3, 'Name must be at least 3 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'], 
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,'Email is not valid']
    },
    birthday: {
        type: SchemaTypes.Date,
        required: [true, 'Birthday is required']
    }
}, { timestamps: true, versionKey: false });
export const userModel = model('users', UserSchema);
