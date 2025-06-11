// установка CORS  заголовков
//  явно указанные домены:
import { NextFunction, Response, Request } from "express";

const allowedOrigins = ["http://localhost:3000", "http://localhost:8080"];
export const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin as string)) {
        res.setHeader("Access-Control-Allow-Origin", origin as string);
    }
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
};
