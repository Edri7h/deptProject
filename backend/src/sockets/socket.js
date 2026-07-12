import { Server } from "socket.io";


let io;

export const initSocket = (server) => {

    io = new Server(server, {

        cors: {
            origin: process.env.FRONTEND_URL,
            credentials: true

        }
    })

    io.on("connection", (socket) => {
        console.log("Socket connected", socket.id);

        socket.on("register", (userId) => {
            socket.join(userId.toString());

            console.log(`User ${userId} joined room ${userId}`);

            io.to(userId.toString()).emit("hello", {
                message: "you are online"
            });
        })

        socket.on("disconnect", () => {
            console.log("Socket disconnected", socket.id);
        })
    })



    return io;
}


export const getSocket = () => {
    if (!io) throw new Error("Socket.io not initialized");
    return io;
}