import app from "./app";
import { socketIo } from "./sockets";
import { connectDB } from "./config/db";
import { validateEnv } from "./config/env";
import { handleGracefulShutdown } from "./config/shutdown";

validateEnv();

connectDB()
    .then(() => {
        const server = app.listen(process.env.PORT!);
        const io = socketIo.init(server);

        io.on("connection", socket => {
            console.log("Client connected");
        });

        handleGracefulShutdown(server);
    })
    .catch(err => {
        console.error(err);
    });
