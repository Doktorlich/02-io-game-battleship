import { UserDocument } from "../../models/user";

declare global {
    namespace Express {
        interface Request {
            userId?: string;
            newAccessToken?: string;
        }
    }
}
