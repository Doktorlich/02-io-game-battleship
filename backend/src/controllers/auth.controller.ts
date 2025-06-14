// router.get("/register");
// router.post("/register");

// router.get("/login");
// router.post("/login");

// router.post("/refresh");

// router.post("/logout");

// router.get("/me");
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import { Error } from "mongoose";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { CustomError } from "../@types/custom";
import { validateEnv } from "../config/env";
import { validateUser, generateTokens } from "../services/auth.service";

validateEnv();
async function postRegister(req: Request, res: Response, next: NextFunction) {
    const body = req.body;
    const email = body.email;
    const name = body.name;
    const password = body.password;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation failed.") as CustomError;
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 4);
        const user = new User({
            email: email,
            name: name,
            password: hashedPassword,
        });
        const result = await user.save();
        console.log(result);
        res.status(201).json({ message: "User created", userId: result._id });
    } catch (error: any) {
        if (!error.statusCode) {
            error.statusCode = 500;
            console.log("postRegister error:", error);
        }
        console.log("postRegister error:", error);
        next(error);
    }
}
async function postLogin(req: Request, res: Response, next: NextFunction) {
    const body = req.body;
    const email = body.email;
    const password = body.password;
    try {
        const user = await validateUser(email, password);

        const { accessToken, refreshToken } = generateTokens(user);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV! === "production",
            sameSite: "lax",
            maxAge: 1000 * 60 * 30,
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV! === "production",
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });
        res.cookie(
            "user",
            {
                userId: user._id.toString(),
                email: user.email,
            },
            { httpOnly: true, secure: process.env.NODE_ENV! === "production", sameSite: "lax" },
        );

        res.status(200).json({
            accessToken: accessToken,
            refreshToken: refreshToken,
            userId: user._id.toString(),
        });
    } catch (error: any) {
        if (!error.statusCode) {
            error.statusCode = 500;
            console.log("postLogin error:", error);
        }
        console.log("postLogin error:", error);
        next(error);
    }
}
async function postLogout(req: Request, res: Response, next: NextFunction) {
    try {
        res.clearCookie("connect.sid", {
            // Это стандартное имя куки для express-session
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV! === "production",
            sameSite: "lax",
            maxAge: 1000 * 60 * 30,
        });
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV! === "production",
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });
        res.clearCookie("user", { httpOnly: true, secure: process.env.NODE_ENV! === "production", sameSite: "lax" });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error: any) {
        if (!error.statusCode) {
            error.statusCode = 500;
            console.log("postLogout error:", error);
        }
        console.log("postLogout error:", error);
        next(error);
    }
}
async function postRefresh(req: Request, res: Response, next: NextFunction) {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            const error = new Error("Refresh token is not valid.") as CustomError;
            error.statusCode = 401;
            throw error;
        }
        const decodedRefreshToken = jwt.verify(refreshToken, process.env.SECRET_REFRESH_JWT!) as {
            userId: string;
            email: string;
        };
        const user = await User.findOne({ email: decodedRefreshToken.email });
        if (!user) {
            const error = new Error("User not found.") as CustomError;
            error.statusCode = 401;
            throw error;
        }
        const newAccessToken = jwt.sign({ userId: user._id.toString(), email: user.email }, process.env.SECRET_ACCESS_JWT!, { expiresIn: "30m" });
        const newRefreshToken = jwt.sign({ userId: user._id.toString(), email: user.email }, process.env.SECRET_REFRESH_JWT!, { expiresIn: "7d" });

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV! === "production",
            sameSite: "lax",
            maxAge: 1000 * 60 * 30,
        });
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV! === "production",
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });
        res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken, userId: user._id.toString() });
    } catch (error: any) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        console.log("postRefresh error:", error);
        next(error);
    }
}
export const authControllers = {
    // getLogin,
    postLogin,
    postRegister,
    // postRegister,
    postRefresh,
    postLogout,
    // getMe,
    // postMe,
};
