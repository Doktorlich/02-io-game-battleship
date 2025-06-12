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
        }
        next(error);
    }
}
async function postLogin(req: Request, res: Response, next: NextFunction) {
    const body = req.body;
    const email = body.email;
    const password = body.password;
    let loadedUser;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            const error = new Error("A user with this email could not be found.") as CustomError;
            error.statusCode = 401;
            throw error;
        }
        loadedUser = user;

        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            const error = new Error("Wrong password.") as CustomError;
            error.statusCode = 401;
            throw error;
        }

        const accessToken = jwt.sign(
            {
                userId: loadedUser._id.toString(),
                email: loadedUser.email,
            },
            process.env.SECRET_ACCESS_JWT!,
            { expiresIn: "30m" },
        );
        const refreshToken = jwt.sign(
            {
                userId: loadedUser._id.toString(),
                email: loadedUser.email,
            },
            process.env.SECRET_REFRESH_JWT!,
            { expiresIn: "30d" },
        );
        req.session.user = user;
        req.session.accessToken = accessToken;
        req.session.refreshToken = refreshToken;
        req.session.save((error: any) => {
            if (error) {
                const error = new Error("Session saving error.") as CustomError;
                error.statusCode = 401;
                throw error;
            }
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
                maxAge: 1000 * 60 * 60 * 24 * 30,
            });
        });

        res.status(200).json({
            accessToken: accessToken,
            refreshToken: refreshToken,
            userId: loadedUser._id.toString(),
        });
    } catch (error: any) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

export const authControllers = {
    // getLogin,
    postLogin,
    postRegister,
    // postRegister,
    // postRefresh,
    // postLogout,
    // getMe,
    // postMe,
};
