import mongoose from "mongoose";

export const handleGracefulShutdown = (server: any) => {
    process.on("SIGINT", async () => {
        await mongoose.connection.close();
        server.close(() => {
            console.log("Server closed");
            process.exit(0);
        });
    });
};
