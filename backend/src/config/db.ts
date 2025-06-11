import mongoose from "mongoose";

export const connectDB = async () => {
    mongoose.connection.on("error", err => {
        console.error("MongoDB connection error:", err);
    });

    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("Connected to MongoDB");
};
