import api from "./api";

export const getNotificationsAPI = () => {
  return api.get("/users/notifications");
};

export const acceptInviteAPI = (requestId, notificationId) => {
  return api.post("/users/accept-invite", {
    requestId,
    notificationId,
  });
};

export const rejectInviteAPI = (requestId, notificationId) => {
  return api.post("/users/reject-invite", {
    requestId,
    notificationId,
  });
};
