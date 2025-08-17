import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUser, User } from '../schema/User';


interface LoginRequest extends Request {
    body: {
        email: string;
        password: string;
    }
}

interface LoginResponse {
    message: string;
    user?: {
        userName: string;
        email: string;
        userType: string;
        id: string;
    };
    token?: string;
}

export const login = async (req: LoginRequest, res: Response): Promise<Response<LoginResponse>> => {
    try {
        const { email, password } = req.body;

        // Validate input fields
        if (!email || !password) {
            return res.status(400).json({ 
                message: "Please fill all fields" 
            });
        }

        // Check if user exists
        const existingUser: IUser | null = await User.findOne({ email });
        if (!existingUser) {
            return res.status(401).json({ 
                message: "Invalid email or password" 
            });
        }

        // Verify password
        const isPasswordCorrect: boolean = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ 
                message: "Invalid email or password" 
            });
        }

        // Check JWT secret
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: existingUser._id,
                email: existingUser.email,
                userType: existingUser.userType
            }, 
            jwtSecret, 
            {
                expiresIn: process.env.JWT_EXPIRES_IN || '24h',
            }
        );

        // Set secure HTTP-only cookie
        res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
        });

        // Log successful login (remove in production)
        console.log(`User logged in: ${existingUser.email}`);

        // Send success response (exclude sensitive data)
        return res.status(200).json({
            message: "Login successful",
            user: {
                id: existingUser.id.toString(),
                userName: existingUser.userName,
                email: existingUser.email,
                userType: existingUser.userType
            },
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            message: "An error occurred during login",
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// Logout function
export const logout = async (req: Request, res: Response): Promise<Response> => {
    try {
        // Clear the access token cookie
        res.clearCookie("access_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        return res.status(200).json({
            message: "Logout successful"
        });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({
            message: "An error occurred during logout"
        });
    }
};