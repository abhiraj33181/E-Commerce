import User from "../models/User.js";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";


export interface LoginBody {
    email: string;
    password: string;
}

export interface RegisterBody {
    name: string;
    email: string;
    password: string;
}

export const registerUser = async (req: Request<{}, {}, RegisterBody>, res: Response) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }


        const hashedPassword = bcrypt.hashSync(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET!, { expiresIn: "7d" });

        const user = await User.findById(newUser._id).select("-password");

        res.status(201).json({
            token,
            user,
            message: "User registered successfully"
        });
    } catch (error) {
        res.status(500).json({ message: "Error registering user" });
    }
}


export const loginUser = async (req: Request<{}, {}, LoginBody>, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "7d" });

        res.status(200).json({ message: "Login successful", token, user });
    } catch (error) {
        res.status(500).json({ message: "Error logging in" });
    }
}

export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user profile" });
    }
}