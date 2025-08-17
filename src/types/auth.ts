export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    message: string;
    data?: {
        id: string;
        userName: string;
        email: string;
        userType: 'admin' | 'user';
    };
    token?: string;
}

export interface JWTPayload {
    id: string;
    email: string;
    userType: 'admin' | 'user';
    iat?: number;
    exp?: number;
}

export interface AuthenticatedRequest extends Request {
    user?: JWTPayload;
}