import { Document } from 'mongoose';

export interface IUser extends Document {
    id: string;
    userName: string;
    email: string;
    password: string;
    userType: string; // 'admin' | 'user'
    address?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CreateUserRequest {
    userName: string;
    email: string;
    password: string;
    userType: string;
    address?: string;
}

export interface UserResponse {
    id: string;
    userName: string;
    email: string;
    userType: string;
    address?: string;
    updatedAt?: Date;
    createdAt?: Date;
}

export interface ApiResponse<T = any> {
    message: string;
    user?: T;
    error?: string;
}