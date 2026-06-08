import api from "./api";

export const searchProfessorAPI = (info) => {
  return api.get(`/mentor/search-professor?info=${encodeURIComponent(info)}`);
};

export const sendMentorRequestAPI = (teamId, professorId) => {
  return api.post("/mentor/request", {
    teamId,
    professorId,
  });
};

export const getSentMentorRequestsAPI = () => {
  return api.get("/mentor/sent-requests");
};

export const cancelMentorRequestAPI = (requestId) => {
  return api.delete(`/mentor/request/${requestId}`);
};

export const getMentorRequestsAPI = () => {
  return api.get("/mentor/requests");
};

export const acceptMentorRequestAPI = (requestId, notificationId) => {
  return api.post("/mentor/accept", {
    requestId,
    notificationId,
  });
};

export const rejectMentorRequestAPI = (requestId, notificationId) => {
  return api.post("/mentor/reject", {
    requestId,
    notificationId,
  });
};
