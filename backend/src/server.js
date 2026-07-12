import app from "./app.js"
import dotenv from "dotenv";
import http from "http";
import {initSocket} from "./sockets/socket.js"
dotenv.config();
const PORT=process.env.PORT || 3000;

const server = http.createServer(app);
const io = initSocket(server);



server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})

// app.listen(PORT,()=>{   
//     console.log(`Server is running on port ${PORT}`);
// })
