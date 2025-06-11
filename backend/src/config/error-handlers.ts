import { NextFunction, Request, Response } from "express";
import { CustomError } from "../types/errors.type";
import app from "../app";
export const registerProcessEvents = () => {
    process.on("unhandledRejection", err => {
        console.error("Unhandled Rejection:", err);
    });

    process.on("uncaughtException", err => {
        console.error("Uncaught Exception:", err);
    });
};
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        status: "error",
        message: "Resource not found",
        path: req.originalUrl,
    });
};
export const globalErrorHandler = (
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    console.log(err);
    const status = err.statusCode || 500;
    const message = err.message;
    const data = err.data;
    res.status(status).json({ message: message, data: data });
};
