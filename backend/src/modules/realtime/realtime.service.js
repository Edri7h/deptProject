import { getSocket } from "../../sockets/socket.js";

class RealtimeService {

    static emitToUser(userId, event, payload) {

        const io = getSocket();

        io.to(userId.toString()).emit(event, payload);

    }

}

export default RealtimeService;