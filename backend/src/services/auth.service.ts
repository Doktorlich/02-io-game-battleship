import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { Error, Types } from "mongoose";
import { CustomError } from "../@types/custom";
import bcrypt from "bcryptjs";

export async function validateUser(email: string, password: string) {
    const user = await User.findOne({ email: email });
    if (!user) {
        const error = new Error("User not found.") as CustomError;
        error.statusCode = 401;
        throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
        const error = new Error("Wrong password.") as CustomError;
        error.statusCode = 401;
        throw error;
    }
    return user;
}
export function generateTokens(user: { _id: Types.ObjectId | string; email: string }) {
    return {
        accessToken: jwt.sign(
            {
                userId: user._id.toString(),
                email: user.email,
            },
            process.env.SECRET_ACCESS_JWT!,
            { expiresIn: "30m" },
        ),
        refreshToken: jwt.sign(
            {
                userId: user._id.toString(),
                email: user.email,
            },
            process.env.SECRET_REFRESH_JWT!,
            { expiresIn: "30d" },
        ),
    };
}
