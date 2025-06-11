import { Server, ServerOptions } from "socket.io";
import http from "http";
let io: Server;

export const socketIo = {
    init: (httpServer: http.Server) => {
        io = new Server(httpServer, {
            cors: {
                origin: "http://localhost:3000",
                methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
                credentials: true,
            },
        });
        return io;
    },
    getIO: () => {
        if (!io) {
            throw new Error("Socked.io not initialized");
        }
        return io;
    },
};
