import dotenv from "dotenv";
export const applyEnv = dotenv.config();

export const validateEnv = () => {
    if (!process.env.MONGODB_URI || !process.env.PORT) {
        throw new Error("Required environment variables are missing");
    }
};
