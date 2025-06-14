import { NextFunction, Request, Response } from "express";
import { CustomError } from "../@types/custom";
import jwt from "jsonwebtoken";

export async function isAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.get("Authorization");
        if (!authHeader) {
            const error = new Error("Not authenticated") as CustomError;
            error.statusCode = 401;
            throw error;
        }
        const token = authHeader.split(" ")[1];
        let decodedAccessToken = jwt.verify(token, process.env.SECRET_ACCESS_JWT!) as { userId: string };

        req.userId = decodedAccessToken.userId;
        next();
    } catch (error: any) {
        if (!error.statusCode) {
            error.statusCode = 500;
            console.log("isAuth error:", error);
        }
        console.log("isAuth error:", error);
        next(error);
    }
}
