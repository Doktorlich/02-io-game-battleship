import User from "../models/user.model";
import { Error } from "mongoose";
import { CustomError } from "../@types/custom";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function validateUserGame(accessToken: string) {
    if (!accessToken) {
        const error = new Error("Not authorized") as CustomError;
        error.statusCode = 403;
        throw error;
    }
    const decodedAccessToken = jwt.verify(accessToken, process.env.SECRET_ACCESS_JWT!) as {
        userId: string;
        email: string;
    };
    const user = await User.findOne({ email: decodedAccessToken.email });
    if (!user) {
        const error = new Error("User not found") as CustomError;
        error.statusCode = 401;
        throw error;
    }
    return user;
}
