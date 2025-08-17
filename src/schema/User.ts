import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    userName: string;
    email: string;
    password: string;
    userType: 'admin' | 'user';
    address?: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema: Schema<IUser> = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },

    userType: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
        required: true
    },
    
    address: {
        type: String,
        required: false
    }
}, { 
    timestamps: true 
});

export const User = mongoose.model<IUser>('User', userSchema);