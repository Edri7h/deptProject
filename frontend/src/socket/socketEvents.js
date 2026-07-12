import { addNotification } from "@/redux/slices/notificationSlice";
import socket from "./socket";
import { toast } from "sonner";

export const registerSocketEvents = (dispatch) => {

    socket.on("teamInviteReceived", (notification) => {

        dispatch(addNotification(notification));

        toast.success(notification.message);

    });

    // socket.on("mentorRequestReceived", (...) => {

    // });

    // socket.on("inviteAccepted", (...) => {

    // });

};


export const unregisterSocketEvents = () => {

    socket.off("teamInviteReceived");
    socket.off("mentorRequestReceived");
    socket.off("inviteAccepted");
    socket.off("connect");
      socket.off("connect_error");

};