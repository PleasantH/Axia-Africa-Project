import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { IUser, User } from '../schema/User';
import { UserResponse } from '../types/userTypes';

interface CreateUserRequest extends Request {
    body: {
        userName: string;
        email: string;
        password: string;
        userType: string;
        address: string;
    }
}

export const createUser = async (req: CreateUserRequest, res: Response): Promise<Response> => {
    try {
        const { userName, email, password, userType, address } = req.body;

        // Check if all fields are provided
        if (!userName || !email || !password || !userType || !address) {
            return res.status(400).json({ 
                message: 'Please fill all fields' 
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                message: 'User already exists' 
            });
        }

        // Hash password
        const salt: number = 12;
        const hashedPassword: string = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            userName,
            password: hashedPassword,
            email,
            userType,
            address
        });

        await newUser.save();

        // Return success response (exclude password from response)
        const userResponse = {
            id: newUser._id,
            userName: newUser.userName,
            email: newUser.email,
            userType: newUser.userType,
            address: newUser.address
        };

        return res.status(201).json({
            message: 'User created successfully',
            user: userResponse
        });

    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({
            message: "An error occurred while creating the user",
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// Fetch all users
export const fetchUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
        // Find all users and exclude passwords
        const users: IUser[] = await User.find().select('-password');
        
        if (!users || users.length === 0) {
            return res.status(404).json({
                message: "No users found",
                data: [],
                count: 0
            });
        }

        // Format user data
        const userResponse: UserResponse[] = users.map(user => ({
            id: user.id.toString(),
            userName: user.userName,
            email: user.email,
            userType: user.userType,
            address: user.address,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }));

        return res.status(200).json({
            message: "Users retrieved successfully",
            data: userResponse,
            count: userResponse.length
        });

    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({
            message: "An error occurred while fetching users",
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// Fetch a single user by email
export const fetchAUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email } = req.params;

        // Validate email parameter
        if (!email) {
            return res.status(400).json({
                message: "Email parameter is required"
            });
        }

        // Find user by email and exclude password
        const user: IUser | null = await User.findOne({ email }).select('-password');
        
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Format user data
        const userResponse: UserResponse = {
            id: user.id.toString(),
            userName: user.userName,
            email: user.email,
            userType: user.userType,
            address: user.address,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        return res.status(200).json({
            message: "User retrieved successfully",
            data: userResponse
        });

    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({
            message: "An error occurred while fetching user",
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// Fetch user by ID (alternative)
export const fetchUserById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;

        // Validate ID parameter
        if (!id) {
            return res.status(400).json({
                message: "User ID parameter is required"
            });
        }

        // Find user by ID and exclude password
        const user: IUser | null = await User.findById(id).select('-password');
        
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Format user data
        const userResponse: UserResponse = {
            id: user.id.toString(),
            userName: user.userName,
            email: user.email,
            userType: user.userType,
            address: user.address,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        return res.status(200).json({
            message: "User retrieved successfully",
            data: userResponse
        });

    } catch (error) {
        console.error('Error fetching user by ID:', error);
        return res.status(500).json({
            message: "An error occurred while fetching user",
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// Update user
export const updateUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const { userName, email, userType, address } = req.body;

        // Validate ID parameter
        if (!id) {
            return res.status(400).json({
                message: "User ID parameter is required"
            });
        }

        // Check if user exists
        const existingUser = await User.findById(id);
        if (!existingUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Check if email is taken by another user
        if (email && email !== existingUser.email) {
            const emailExists = await User.findOne({ email, _id: { $ne: id } });
            if (emailExists) {
                return res.status(409).json({
                    message: "Email is already taken by another user"
                });
            }
        }

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { userName, email, userType, address },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Format user data
        const userResponse: UserResponse = {
            id: updatedUser.id.toString(),
            userName: updatedUser.userName,
            email: updatedUser.email,
            userType: updatedUser.userType,
            address: updatedUser.address,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt
        };

        return res.status(200).json({
            message: "User updated successfully",
            data: userResponse
        });

    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({
            message: "An error occurred while updating user",
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// Delete user
export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;

        // Validate ID parameter
        if (!id) {
            return res.status(400).json({
                message: "User ID parameter is required"
            });
        }

        // Find and delete user
        const deletedUser = await User.findByIdAndDelete(id).select('-password');
        
        if (!deletedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "User deleted successfully",
            data: {
                id: deletedUser.id.toString(),
                userName: deletedUser.userName,
                email: deletedUser.email
            }
        });

    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({
            message: "An error occurred while deleting user",
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};